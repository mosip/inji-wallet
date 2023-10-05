package io.mosip.test.mob.inji.driver;


import java.io.File;
import java.util.ArrayList;
import java.util.List;

import io.mosip.test.mob.inji.listeners.Listeners;
import io.mosip.test.mob.inji.testcases.*;
import io.mosip.test.mob.inji.utils.TestDataReader;
import org.testng.TestListenerAdapter;
import org.testng.TestNG;


public class TestRunner {
public static String jarUrl = TestRunner.class.getProtectionDomain().getCodeSource().getLocation().getPath();
	static TestListenerAdapter tla = new TestListenerAdapter();

	
	static TestNG testNg;
	
	public static void main(String[] args) throws Exception {
		testNg=new TestNG();
		System.out.println("testng file started");
		String listExcludedGroups=TestDataReader.readData("setExcludedGroups");
		testNg.setExcludedGroups(listExcludedGroups);
		testNg.setPreserveOrder(true);
		testNg.setVerbose(2);
////		 List<String> suitefiles = new ArrayList<String>();
////		 suitefiles.add("testng.xml");
//		 testNg.setTestSuites(suitefiles);
	//	 testNg.setTestClasses(new Class[]{Listeners.class});
		
		testNg.setTestClasses(new Class[] {
				
				ActivateVcTest.class,
				ChangeLanguageTest.class,
				DeletingVcTest.class,
				GenerateUinOrVidTest.class,
				PinVcTest.class,
				UnlockWithPasscodeTest.class,
				VcDownloadAndVerifyUsingUinTest.class,
				VcDownloadAndVerifyUsingVidTest.class,
				VerifyHelpPageTest.class,
				VerifyHistoryTest.class,
				VerifyWelcomePagesTest.class
				
				
		});
		testNg.run();
		
	}
	/*
	<suite name="All Test Suite" parallel="tests" thread-count="2">
    <listeners>
        <listener class-name="listeners.Listeners"/>
    </listeners>
    <test verbose="2" preserve-order="true" name="android">
        <parameter name="platformName" value="ANDROID"/>
	*/
	
	public static String getResourcePath() {
		if (checkRunType().equalsIgnoreCase("JAR")) {
			return new File(jarUrl).getParentFile().getAbsolutePath().toString()+"/resources/";
		} else if (checkRunType().equalsIgnoreCase("IDE")) {
	        String path = System.getProperty("user.dir");

 

		//	String path = new File(TestRunner.class.getClassLoader().getResource("").getPath()).getAbsolutePath()
	//				.toString();
			if (path.contains("test-classes"))
				path = path.replace("test-classes", "classes");
			return path;
		}
		return "Global Resource File Path Not Found";
	}
	
	public static String checkRunType() {
		if (TestRunner.class.getResource("TestRunner.class").getPath().toString().contains(".jar"))
			return "JAR";
		else
			return "IDE";
	}

}
