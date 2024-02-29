package inji.api;

import io.restassured.response.Response;
import org.json.simple.JSONObject;

import java.util.Map;


public class KernelAuthentication extends BaseTestCase {
	private final String authRequest="/config/Authorization/request.json";
	private final String authInternalRequest="/config/Authorization/internalAuthRequest.json";
	String cookie;
	static String dataKey = "response";
	CommonLibrary clib= new CommonLibrary();
	public final Map<String, String> props = clib.readProperty("Kernel");
	private final String admin_password = props.get("admin_password");
	private final String admin_userName=props.get("admin_userName");
	private final String authenticationInternalEndpoint = props.get("authenticationInternal");
	private final ApplicationLibrary appl=new ApplicationLibrary();




	public String getTokenByRole(String role) {
		return getTokenByRole(role, null);
	}

	public String getTokenByRole(String role, String tokenType)
	{
		String insensitiveRole = null;
		if(role!=null)
			insensitiveRole = role.toLowerCase();
		else return "";

		switch(insensitiveRole) {

		case "idrepo":
			if(!kernelCmnLib.isValidToken(idrepoCookie))
				idrepoCookie = kernelAuthLib.getAuthForIDREPO();
			return idrepoCookie;
		case "admin":
			if(!kernelCmnLib.isValidToken(adminCookie))
				adminCookie = kernelAuthLib.getAuthForAdmin();
			return adminCookie;
		default:
			if(!kernelCmnLib.isValidToken(adminCookie))
				adminCookie = kernelAuthLib.getAuthForAdmin();
			return adminCookie;			
		}

	}

	@SuppressWarnings("unchecked")
	public String getAuthForIDREPO() {
		JSONObject actualrequest = getRequestJson(authRequest);

		JSONObject request=new JSONObject();
		request.put("appId", ConfigManager.getidRepoAppId());
		request.put("clientId", ConfigManager.getidRepoClientId());
		request.put("secretKey", ConfigManager.getIdRepoClientSecret());
		actualrequest.put("request", request);

		Response reponse=appl.postWithJson(props.get("authclientidsecretkeyURL"), actualrequest);
		cookie=reponse.getCookie("Authorization");
		return cookie;
	}

	@SuppressWarnings("unchecked")
	public String getAuthForAdmin() {

		JSONObject actualrequest = getRequestJson(authInternalRequest);

		JSONObject request = new JSONObject();
		request.put("appId", ConfigManager.getAdminAppId());
		request.put("password", admin_password);

		//if(BaseTestCase.currentModule==null) admin_userName=
		request.put("userName", BaseTestCase.currentModule +"-"+ admin_userName);

		request.put("clientId", ConfigManager.getAdminClientId());
		request.put("clientSecret", ConfigManager.getAdminClientSecret());
		actualrequest.put("request", request);

		Response reponse = appl.postWithJson(authenticationInternalEndpoint, actualrequest);
		String responseBody = reponse.getBody().asString();
		String token = new org.json.JSONObject(responseBody).getJSONObject(dataKey).getString("token");
		return token;
	}
}
