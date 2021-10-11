package com.cevier.rpro.db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class Tools {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
//		System.out.println(Tools.Verify("Cevier", "CevierCc"));
//		Tools.UserSubmit("01", "skdrguseyhiu", "127.0.0.1");
//		Tools.SaveQuestionnaire("ÎÊ¾í", "fewfwefwe");
//		Tools.UpdateQueationnaire(1, "¶ø°®¸§¶öÅ¶", "sekrfshelk");
//		Tools.DeleteQueationnaire(3);
		
//		Vector<Questionnaire> r = Tools.Questionnaires();
//		for(Questionnaire qnr: r)
//			System.out.println(qnr.GetQID() + qnr.GetQName() + qnr.GetSubmitNumber() + qnr.GetCreateDate());
		
//		String qnr = Tools.getQuestionnaire(24);
//		int a = (int)qnr.length() / 8000 + 1;
//		String[] subQnr = new String[a];
//		for(int i = 0; i + 1 < a; i++)
//			subQnr[i] = qnr.substring(0 + i * 8000, 8000 + i * 8000);
//		subQnr[a - 1] = qnr.substring((a - 1) * 8000);
//		System.out.println(a);
		
//		ArrayList<String> UserAsrs = Tools.getRawResult("23");
//		if(UserAsrs != null)
//			System.out.println("notnull");
//		else
//			System.out.println("null");
	}
	
	/**
	 * Get Questions's Answer
	 * @param QID
	 * @return Array List String User Answers
	 */
	public static ArrayList<String> getRawResult(String QID) {
		try {
			ArrayList<String> UserAsrs = new ArrayList<String>();
			Connection conn = Connect.getMySQLConnection();
			String sql = "SELECT UserAsr FROM Q" + QID;
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.execute(sql);
			ResultSet rSet = ps.executeQuery();
			while(rSet.next()) {
				UserAsrs.add(rSet.getString("UserAsr"));
			}
			rSet.close();
			ps.close();
			conn.close();
			return UserAsrs;
		}catch(Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	/**
	 * Get Questionnaire by QID
	 * @param QID
	 * @return String
	 * "None" for null
	 * "Deleted" for Questionnaire isn't exist
	 */
	public static String getQuestionnaire(int QID) {
		String qs = "None";
		try {
			Connection conn = Connect.getMySQLConnection();
			String sql = "SELECT * FROM Questionnaires WHERE QID=" + QID;
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.execute(sql);
			ResultSet rSet = ps.executeQuery();
			while(rSet.next()) {
				if(rSet.getInt("DeleteTag") == 1)
					qs = "Deleted";
				else
					qs = rSet.getString("Questions");
			}
			rSet.close();
			ps.close();
			conn.close();
			return qs;
		}catch(Exception e) {
			e.printStackTrace();
			return qs;
		}
	}
	
	/**
	 * Query questionnaires
	 * @return Vector<Questionnaire>
	 */
	@SuppressWarnings("rawtypes")
	public static ArrayList<Map> Questionnaires() {
		ArrayList<Map> maps = new ArrayList<>();
		try {
			Connection conn = Connect.getMySQLConnection();
			String sql = "SELECT * FROM Questionnaires WHERE DeleteTag=0";
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.execute(sql);
			ResultSet rSet = ps.executeQuery();
			while(rSet.next()) {
				Map<String, Object> map = new HashMap<String, Object>();
				map.put("questionnairename", rSet.getString("qName"));
				map.put("submitnumbers", rSet.getInt("SubmitNumber"));
				map.put("createdate", rSet.getString("CreateDate"));
				map.put("qid", rSet.getInt("QID"));
				maps.add(map);
			}
			rSet.close();
			ps.close();
			conn.close();
			return maps;
		}catch(Exception e) {
			e.printStackTrace();
			return maps;
		}
	}
	
	/**
	 * Delete Questionnaire
	 * @param QID
	 * @return boolean
	 */
	public static boolean DeleteQueationnaire(int QID) {
		try {
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String time = format.format(new Date());
			Connection conn = Connect.getMySQLConnection();
			String sql = "UPDATE Questionnaires SET LastUpdate='"+ time +"', DeleteTag=1 WHERE QID=" + QID;
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.execute(sql);
			ps.close();
			conn.close();
			
			return true;
		}catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	/**
	 * Update Questionnaire by QID
	 * @param QID
	 * @param QName
	 * @param Questions
	 * @return boolean
	 */
	public static boolean UpdateQueationnaire(int QID, String QName, String Questions) {
		try {
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String time = format.format(new Date());
			Connection conn = Connect.getMySQLConnection();
			String sql = "UPDATE Questionnaires SET QName='"+ QName +"', Questions='"+ Questions +"', "
					+ "LastUpdate='"+ time +"' WHERE QID=" + QID;
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.execute(sql);
			ps.close();
			conn.close();
			
			return true;
		}catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	/**
	 * Create Questionnaire
	 * @param QName
	 * @param Questions
	 * @return Boolean
	 */
	public static boolean SaveQuestionnaire(String QName, String Questions) {
		try {
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String time = format.format(new Date());
			Connection conn = Connect.getMySQLConnection();
			String sql = "INSERT INTO Questionnaires (QName, CreateDate, Questions, SubmitNumber, DeleteTag, LastUpdate) "
					+ "VALUES ('"+ QName +"', '"+ time +"', '"+ Questions +"', 0, 0, '"+ time +"');";
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.execute(sql);
			ps.close();
			conn.close();
			
			return true;
		}catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	/**
	 * deal user's option data
	 * @param QID
	 * @param UserAsr
	 * @param IP
	 * @return boolean
	 */
	public static boolean UserSubmit(String QID, String UserAsr, String IP) {
		try {
			String Fqid = "Q" + QID;
			String sql = null;
			Connection conn = Connect.getMySQLConnection();
			ResultSet rs = conn.getMetaData().getTables(null, null, Fqid, null);
			if(!rs.next()) {
				//table isn't exist, create table
				sql = "CREATE TABLE `"+ Fqid +"` (`ID` int NOT NULL AUTO_INCREMENT, "
							+ "`UserAsr` varchar(1024) CHARACTER SET utf8, `IP` varchar(64), "
							+ "`SbtDate` varchar(64), PRIMARY KEY (`ID`))";
				PreparedStatement ps = conn.prepareStatement(sql);
				ps.execute(sql);
				ps.close();
			}
			
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String time = format.format(new Date());
			
			sql = "INSERT INTO " + Fqid +" (UserAsr, IP, SbtDate) VALUES ('"+ UserAsr +"', '"+ IP +"', '"+ time +"')";
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.execute(sql);
			ps.close();
			
			//Update Submit Number
			int SubmitNumber = 0;
			sql = "SELECT SubmitNumber FROM Questionnaires WHERE QID=" + QID;
			ps = conn.prepareStatement(sql);
			ps.execute(sql);
			ResultSet rSet = ps.executeQuery();
			while(rSet.next()) {
				SubmitNumber = rSet.getInt("SubmitNumber");
			}
			rSet.close();
			ps.close();
			SubmitNumber += 1;
			sql = "UPDATE Questionnaires SET SubmitNumber=" + SubmitNumber + " WHERE QID=" + QID;
			ps = conn.prepareStatement(sql);
			ps.execute(sql);
			ps.close();
			conn.close();
			return true;
		}catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	/**
	 * verify user permission
	 * Tools.Verify("Cevier", "CevierCc");
	 * @param Username
	 * @param psw
	 * @return boolean
	 */
	public static boolean Verify(String Username, String psw) {
		boolean bltag = false;
		try {
			Connection conn = Connect.getMySQLConnection();
			String sql = "SELECT * FROM User WHERE UserName='"+ Username + "'";
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.execute(sql);
			ResultSet rSet = ps.executeQuery();
			if(rSet.next()) 
				if(rSet.getString("Psw").equals(psw))
					bltag = true;
			
			rSet.close();
			ps.close();
			conn.close();
		}catch(Exception e) {
			e.printStackTrace();
		}
		return bltag;
	}
}
