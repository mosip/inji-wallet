package io.mosip.test.mob.inji.api.pojo;

import java.util.ArrayList;
import java.util.Date;

public class Root{
	 public ArrayList<Object> attachments;
	 public Headers headers;
	 public ArrayList<HeaderLine> headerLines;
	 public String html;
	 public String subject;
	 public Date date;
	// @JsonProperty("to") 
	 public To to;
	 public From from;
	 public Cc cc;
	 public String messageId;
	 public String type;
	}