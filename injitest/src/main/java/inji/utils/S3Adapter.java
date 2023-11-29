package inji.api.pojo;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import inji.api.ConfigManager;
import inji.utils.StringUtils;
import org.apache.log4j.Logger;
import org.joda.time.DateTime;

import com.amazonaws.ClientConfiguration;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;


public class S3Adapter {
    private static final Logger logger = Logger.getLogger(S3Adapter.class);

    private AmazonS3 connection = null;

    private int maxRetry = 20;

    private int maxConnection = 200;

    private int retry = 0;

    private boolean useAccountAsBucketname = true;

    private static final String SEPARATOR = "/";

    private int reportExpirationInDays = Integer.parseInt(ConfigManager.getReportExpirationInDays());

    private List<String> existingBuckets = new ArrayList<>();

    private AmazonS3 getConnection(String bucketName) {
        if (connection != null)
            return connection;

        logger.info("ConfigManager.getS3UserKey() :: " + ConfigManager.getS3UserKey());
        logger.info("ConfigManager.getS3Host() :: " + ConfigManager.getS3Host());
        logger.info("ConfigManager.getS3Region() :: " + ConfigManager.getS3Region());
        logger.info("ConfigManager.getS3SecretKey() :: " + ConfigManager.getS3SecretKey());
        try {
            AWSCredentials awsCredentials = new BasicAWSCredentials(ConfigManager.getS3UserKey(),
                    ConfigManager.getS3SecretKey());
            connection = AmazonS3ClientBuilder.standard()
                    .withCredentials(new AWSStaticCredentialsProvider(awsCredentials)).enablePathStyleAccess()
                    .withClientConfiguration(
                            new ClientConfiguration().withMaxConnections(maxConnection).withMaxErrorRetry(maxRetry))
                    .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(ConfigManager.getS3Host(),
                            ConfigManager.getS3Region()))
                    .build();

            connection.doesBucketExistV2(bucketName);
            retry = 0;
        } catch (Exception e) {
            if (retry >= maxRetry) {
                // reset the connection and retry count
                retry = 0;
                connection = null;
//                LOGGER.error(SESSIONID, REGISTRATIONID,"Maximum retry limit exceeded. Could not obtain connection for "+ bucketName +". Retry count :" + retry, ExceptionUtils.getStackTrace(e));
//                throw new ObjectStoreAdapterException(OBJECT_STORE_NOT_ACCESSIBLE.getErrorCode(), OBJECT_STORE_NOT_ACCESSIBLE.getErrorMessage(), e);
            } else {
                connection = null;
                retry = retry + 1;
//                LOGGER.error(SESSIONID, REGISTRATIONID,"Exception occured while obtaining connection for "+ bucketName +". Will try again. Retry count : " + retry, ExceptionUtils.getStackTrace(e));
                getConnection(bucketName);
            }
        }
        return connection;
    }

    /*
     * public boolean putObject(String account, final String container, String
     * source, String process, String objectName, File file) { String
     * finalObjectName = null; String bucketName = null;
     * logger.info("useAccountAsBucketname:: "+useAccountAsBucketname); if
     * (useAccountAsBucketname) { finalObjectName = getName(container, source,
     * process, objectName); bucketName = account; } else { finalObjectName =
     * getName(source, process, objectName); bucketName = container; }
     * logger.info("bucketName :: "+bucketName); AmazonS3 connection =
     * getConnection(bucketName); if (!doesBucketExists(bucketName)) {
     * connection.createBucket(bucketName); if (useAccountAsBucketname)
     * existingBuckets.add(bucketName); }
     *
     * connection.putObject(bucketName, finalObjectName, file); return true; }
     */

    public boolean putObject(String account, final String container, String source, String process, String objectName, File file) {
        String finalObjectName = null;
        String bucketName = null;
        boolean bReturn = false;
        logger.info("useAccountAsBucketname:: " + useAccountAsBucketname);
        if (useAccountAsBucketname) {
            finalObjectName = getName(container, source, process, objectName);
            bucketName = account;
        } else {
            finalObjectName = getName(source, process, objectName);
            bucketName = container;
        }
        logger.info("bucketName :: " + bucketName);
        AmazonS3 connection = getConnection(bucketName);
        if (connection != null) {
            if (!doesBucketExists(bucketName)) {
                connection.createBucket(bucketName);
                if (useAccountAsBucketname)
                    existingBuckets.add(bucketName);
            }
            PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, finalObjectName, file);
            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setHttpExpiresDate(new DateTime().plusDays(reportExpirationInDays).toDate());
            putObjectRequest.setMetadata(objectMetadata);
            connection.putObject(putObjectRequest);
            bReturn = true;
        }
        return bReturn;
    }

    private boolean doesBucketExists(String bucketName) {
        // use account as bucket name and bucket name is present in existing bucket list
        if (useAccountAsBucketname && existingBuckets.contains(bucketName))
            return true;
            // use account as bucket name and bucket name is not present in existing bucket
            // list
        else if (useAccountAsBucketname && !existingBuckets.contains(bucketName)) {
            boolean doesBucketExistsInObjectStore = connection.doesBucketExistV2(bucketName);
            if (doesBucketExistsInObjectStore)
                existingBuckets.add(bucketName);
            return doesBucketExistsInObjectStore;
        } else
            return connection.doesBucketExistV2(bucketName);
    }

    /*
     * public boolean reportRetentionPolicy(String bucketName) {
     *
     * ObjectMetadata metadata = new ObjectMetadata(); logger.info("size:" +
     * bytes.length); metadata.setContentLength(bytes.length);
     * metadata.setContentType(contentType); Date expirationTime = new Date(2025, 5,
     * 10); metadata.setExpirationTime(DateTime.now().toDate());
     * metadata.setHeader("x-amz-object-lock-retain-until-date", closerDate +
     * "T00:00:00.000Z"); metadata.setHeader("x-amz-object-lock-mode",
     * "COMPLIANCE"); byte[] md5 = Md5Utils.computeMD5Hash(baInputStream); String
     * md5Base64 = BinaryUtils.toBase64(md5); metadata.setHeader("Content-MD5",
     * md5Base64); baInputStream.reset(); PutObjectRequest putRequest = new
     * PutObjectRequest(bucketName, finalObjectName, baInputStream, metadata);
     * s3client.putObject(putRequest);
     *
     *
     * return true;
     *
     * }
     */

    public static String getName(String container, String source, String process, String objectName) {
        String finalObjectName = "";
        if (StringUtils.isNotEmpty(container))
            finalObjectName = container + SEPARATOR;
        if (StringUtils.isNotEmpty(source))
            finalObjectName = finalObjectName + source + SEPARATOR;
        if (StringUtils.isNotEmpty(process))
            finalObjectName = finalObjectName + process + SEPARATOR;

        finalObjectName = finalObjectName + objectName;

        return finalObjectName;
    }

    public static String getName(String source, String process, String objectName) {
        String finalObjectName = "";
        if (StringUtils.isNotEmpty(source))
            finalObjectName = source + SEPARATOR;
        if (StringUtils.isNotEmpty(process))
            finalObjectName = finalObjectName + process + SEPARATOR;

        finalObjectName = finalObjectName + objectName;

        return finalObjectName;
    }
}