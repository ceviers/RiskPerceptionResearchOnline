package com.cevier.rpro.dp;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.cevier.rpro.db.Tools;
import com.google.gson.Gson;

public class DataProcess {

	public static void main(String[] args) {
		// TODO Auto-generated method stub 9[l_[hHj{njw#EgxkgtEe:\m`\i:Z@bsfbo@`
//		System.out.println(DataProcess.verifySavedEncryptedCode("9[l_[hHj{njw#EgxkgtEe:\\m`\\i:Z@bsfbo@`"));
		System.out.println(DataProcess.getProcessedResult("23"));
	}
	
	public static boolean getFullExcel(String QID) {
		
		return false;
	}
	
	/**
	 * prepare data for result show
	 * @param QID
	 * @return String questionnaire name -- questions -- user options
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public static String getProcessedResult(String QID) {
		String qnr = Tools.getQuestionnaire(Integer.parseInt(QID));
		Gson gson = new Gson();
		Map<String, Object> map = new HashMap<String, Object>();
		map = gson.fromJson(qnr, map.getClass());
		ArrayList<Map> questionList= (ArrayList<Map>) map.get("questions");//获取问题组
//		System.out.println(map.get("questionnairename"));//打印问卷名字
//		ArrayList<Map> optionList = (ArrayList<Map>) questionList.get(0).get("qoption");//获取第一个（0）问题
//		System.out.println(optionList.get(0).get("content"));//获取选项0的content
		
		//创建问题组
		ArrayList<String> questions = new ArrayList<String>();
		for(int i = 0; i < questionList.size(); i++)
			questions.add((String) questionList.get(i).get("qname"));
		
		//创建选项组
		ArrayList<String> UserAsrs = Tools.getRawResult(QID);//UserAsrs 用户的选择
		ArrayList<String[]> allAsr = new ArrayList<String[]>();
		if(UserAsrs != null) {
			for(int i = 0; i < UserAsrs.size(); i++) {
				ArrayList<String> oneUserAsr = gson.fromJson(UserAsrs.get(i), UserAsrs.getClass());//oneUserAsr一个用户的选择
				String[] oneAsr = new String[oneUserAsr.size()];
				for(int j = 0; j < oneUserAsr.size(); j++) {
					ArrayList<Map> optionList = (ArrayList<Map>) questionList.get(j).get("qoption");
					//处理多选
					String asrStr = oneUserAsr.get(j);//用户第j题的轩泽 
					if(asrStr != null) {
//						System.out.println(i + " " +j + " " + asrStr +"----");
						for(int k = 1; k < asrStr.length(); k++) {
							char charAsrStr = oneUserAsr.get(j).charAt(k);
//							System.out.println(k + " " + charAsrStr);
							if(charAsrStr != 'u') {
								if(oneAsr[j] == null)
									oneAsr[j] = (String) optionList.get((int)charAsrStr - 48).get("content");
								else
									oneAsr[j] += ";\n" + (String) optionList.get((int)charAsrStr - 48).get("content");
							}else if(charAsrStr == 'u') {
								if(oneAsr[j] == null)
									oneAsr[j] = (String)oneUserAsr.get(j).substring(2);
								else
									oneAsr[j] += ";\n" + (String)oneUserAsr.get(j).substring(k + 1);
								break;//处理到u说明一个选项已完成，结束循环
							}
						}
					}
				}
				allAsr.add(oneAsr);
			}
			return map.get("questionnairename") +"-+" + gson.toJson(questions) + "-+" + gson.toJson(allAsr);
		}else
			return null;
	}
	
	/**
	 * Verify Saved Encrypted Code
	 * @param EncryptedCode
	 * @return boolean
	 */
	public static boolean verifySavedEncryptedCode(String EncryptedCode) {
		try {
			String[] ec = EncryptedCode.split("#");
			String User = "";
			for(int i = 0; i < ec[0].length() / 2; i++)
				User += (char)(ec[0].charAt(i) + 10);
			String psw = "";
			for(int i = 0; i < ec[1].length() / 3; i++)
				psw += (char)(ec[1].charAt(i) - 2);
			if(Tools.Verify(User, psw))
				return true;
			else
				return false;
		}catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	/**
	 * Verify User Name and Password
	 * @param User
	 * @param psw
	 * @return String EncryptedCode
	 */
	public static String logIn(String User, String psw) {
		String Code = "";
		if(Tools.Verify(User, psw)) {
			for(int i = 0; i < User.length(); i++)
				Code += (char)(User.charAt(i) - 10);
			for(int i = 0; i < User.length(); i++)
				Code += (char)(User.charAt(i) + 5);
			Code += "#";
			for(int i = 0; i < psw.length(); i++)
				Code += (char)(psw.charAt(i) + 2);
			for(int i = 0; i < psw.length(); i++)
				Code += (char)(psw.charAt(i) - 9);
			for(int i = 0; i < psw.length(); i++)
				Code += (char)(psw.charAt(i) - 3);
		}else
			Code = "Failed";
		
		return Code;
	}
}
