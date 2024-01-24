package inji.api;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

import org.joda.time.DateTime;
import org.apache.commons.lang3.StringUtils;
import com.amazonaws.ClientConfiguration;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.fasterxml.jackson.core.exc.StreamReadException;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

public class S3Adapter {


	private static AmazonS3 connection = null;

	private static int maxRetry = 20;

	private static int maxConnection = 200;

	private static int retry = 0;

	private static boolean  useAccountAsBucketname = true;

	private static final String SEPARATOR = "/";
	
	private int reportExpirationInDays = Integer.parseInt(ConfigManager.getReportExpirationInDays());

	private static List<String> existingBuckets = new ArrayList<>();

	private static AmazonS3 getConnection(String bucketName) {
		 String fileKey ="sanity/personaData.json";
		if (connection != null)
			return connection;

		System.out.println(("ConfigManager.getS3UserKey() :: "+ConfigManager.getS3UserKey()));
		System.out.println(("ConfigManager.getS3Host() :: "+ConfigManager.getS3Host()));
		System.out.println(("ConfigManager.getS3Region() :: "+ConfigManager.getS3Region()));
		System.out.println(("ConfigManager.getS3SecretKey() :: "+ConfigManager.getS3SecretKey()));
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
			//System.out.println(connection.listBuckets());
			System.out.println(connection.doesBucketExistV2(bucketName));
			retry = 0;
		} catch (Exception e) {
			if (retry >= 1) {
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
	
	public boolean 
	putObject(String account, final String container, String source, String process, String objectName, File repotFile) {
		String finalObjectName = null;
		String bucketName = null;
		boolean bReturn = false;
	        System.out.println(("useAccountAsBucketname:: "+useAccountAsBucketname));
		if (useAccountAsBucketname) {
				finalObjectName = getName(container, source, process);
				bucketName = account;
		} else {
				finalObjectName = getName(source, process, objectName);
				bucketName = container;
		}
		System.out.println(("bucketName :: "+bucketName));
		AmazonS3 connection = getConnection(bucketName);
		if (connection != null) {
			if (!doesBucketExists(bucketName)) {
				connection.createBucket(bucketName);
				if (useAccountAsBucketname)
					existingBuckets.add(bucketName);
			}
			PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, finalObjectName, repotFile);
			ObjectMetadata objectMetadata = new ObjectMetadata();
			objectMetadata.setHttpExpiresDate(new DateTime().plusDays(reportExpirationInDays).toDate());
			putObjectRequest.setMetadata(objectMetadata);
			connection.putObject(putObjectRequest);
			bReturn = true;
		}
		return bReturn;
	}

	private static boolean doesBucketExists(String bucketName) {
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

	public static String getName(String container, String source, String process) {
		String finalObjectName = "";
		if (StringUtils.isNotEmpty(container))
			finalObjectName = container + SEPARATOR;
		if (StringUtils.isNotEmpty(source))
			finalObjectName = finalObjectName + source + SEPARATOR;
		if (StringUtils.isNotEmpty(process))
			finalObjectName = finalObjectName + process + SEPARATOR;

		finalObjectName = finalObjectName;

		return finalObjectName;
	}

	public static String getName(String source, String process) {
		String finalObjectName = "";
		if (StringUtils.isNotEmpty(source))
			finalObjectName = source + SEPARATOR;
		if (StringUtils.isNotEmpty(process))
			finalObjectName = finalObjectName + process + SEPARATOR;

		finalObjectName = finalObjectName ;

		return finalObjectName;
	}

	public static boolean putObjectWithMetadata(String account, final String container, String source, String process, String objectName, File sourcefile, ObjectMetadata metadata) {
		ConfigManager.init();
		String finalObjectName = null;
		String bucketName = null;
		boolean bReturn = false;

		if (useAccountAsBucketname) {
			finalObjectName = getName(container, source, process);
			bucketName = account;
		} else {
			finalObjectName = getName(source, process, objectName);
			bucketName = container;
		}

		AmazonS3 connection = getConnection(bucketName);
		if (connection != null) {
			if (!doesBucketExists(bucketName)) {
				connection.createBucket(bucketName);
				if (useAccountAsBucketname)
					existingBuckets.add(bucketName);
			}

			PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, finalObjectName, sourcefile);
			putObjectRequest.setMetadata(metadata);
			connection.putObject(putObjectRequest);
			bReturn = true;
		}

		return bReturn;
	}
	
	
	public static Object GetPersona(String account, final String container, String source, String process, String fileKey) throws StreamReadException, DatabindException, IOException {
		String finalObjectName = null;
		ConfigManager.init();
		String bucketName = null;
		boolean bReturn = false;
		 Object jsonData = null;

		if (useAccountAsBucketname) {
			finalObjectName = getName(container, source, process);
			bucketName = container;
		} else {
			finalObjectName = getName(source, process);
			bucketName = container;
		}

		AmazonS3 connection = getConnection(bucketName);
		if (connection != null) {
			if (!doesBucketExists(bucketName)) {
				connection.createBucket(bucketName);
				if (useAccountAsBucketname)
					existingBuckets.add(bucketName);
			}
	        S3Object s3Object = connection.getObject(new GetObjectRequest(bucketName, fileKey));
	        
	        BufferedReader reader = new BufferedReader(new InputStreamReader(s3Object.getObjectContent()));

	        
	        ObjectMapper objectMapper = new ObjectMapper();
	         jsonData = objectMapper.readValue(reader, Object.class); 
			
		}

		return jsonData;
	}
	
	


//	public static MinioClient connectToMinIO(String endpoint, String accessKey, String secretKey) throws MinioException, InvalidKeyException, NoSuchAlgorithmException, IOException {
//	    try {
//	        // Create a MinioClient instance
//	        MinioClient minioClient = MinioClient.builder()
//	                                      .endpoint(endpoint)
//	                                      .credentials(accessKey, secretKey)
//	                                      .build();
//
//	        // Check if the MinIO server is accessible
//	        BucketExistsArgs bucketExistsArgs = BucketExistsArgs.builder().bucket("automation").build(); // Create BucketExistsArgs object
//	        boolean isMinioAccessible = minioClient.bucketExists(bucketExistsArgs); // Pass the args object
//	        if (!isMinioAccessible) {
//	            throw new RuntimeException("MinIO server is not accessible. Please check the endpoint and credentials.");
//	        }
//
//	        return minioClient;
//	    } catch (MinioException e) {
//	        // Handle potential exceptions during connection
//	        throw new RuntimeException("Failed to connect to MinIO: " + e.getMessage(), e);
//	    }
//	}

	
 

//	    public static  Object GetUinAndVid(String account, final String container) throws StreamReadException, DatabindException, IOException {
//	        String fileKey = "personaData.json";
//	        Object jsonData = null;
//	        
//	        
//			String bucketName = "automation";
//			
//	        AmazonS3 connection = getConnection(bucketName);
//	        S3Object s3Object = connection.getObject(new GetObjectRequest(bucketName, fileKey));
//	        BufferedReader reader = new BufferedReader(new InputStreamReader(s3Object.getObjectContent()));
//
//	        
//	        ObjectMapper objectMapper = new ObjectMapper();
//	         jsonData = objectMapper.readValue(reader, Object.class); // Generic object for any JSON structure
//
//	        
//	        System.out.println(jsonData);
//			
//	    
//			return jsonData;
//
//	    }
}
