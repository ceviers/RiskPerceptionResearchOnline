package com.cevier.rpro.ws;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import com.cevier.rpro.db.Tools;
import com.cevier.rpro.dp.DataProcess;
import com.cevier.rpro.dp.GenerateExcel;
import com.google.gson.Gson;

@ServerEndpoint(value = "/WebSocketRPRO")
public class WebSocket {
	private String subQuestionnaireData = "";
	
	@OnOpen
	public void onOpen(Session session) throws IOException {
//		session.getBasicRemote().sendText("congratulations!");
	}

	@OnClose
	public void onClose() {
		System.out.println("closed");
	}

	@SuppressWarnings({ "rawtypes" })
	@OnMessage
	public void onMessage(String message, Session session) throws IOException {
		System.out.println(message);
		String[] udatas = message.split("--");
		//v验证  c创建的新问卷  m问卷管理 f获取问卷 r填写结果 d删除问卷 e编辑问卷 l登录 q查看结果 g下载Excel文件
		
		if(udatas[0].equals("v")) {
			try {
				if(DataProcess.verifySavedEncryptedCode(udatas[1]))
					session.getBasicRemote().sendText("v--Verified");
				else
					session.getBasicRemote().sendText("v--inVerified");
			}catch(Exception e) {
				session.getBasicRemote().sendText("v--inVerified");
			}
		}	
		if(udatas[0].equals("l")) {
			try {
				String EncryptedCode = DataProcess.logIn(udatas[1], udatas[2]);
				if(EncryptedCode.equals("Failed"))
					session.getBasicRemote().sendText("l--Filed");
				else
					session.getBasicRemote().sendText("l--Success--" + EncryptedCode);
			}catch(Exception e) {
				session.getBasicRemote().sendText("l--Filed");
			}
		}else if(udatas[0].equals("c")){
			this.subQuestionnaireData += udatas[1];
//			System.out.println(this.subQuestionnaireData);
			if(udatas[2].equals(udatas[3])) {
//				Gson gson = new Gson();
//				Map<String, Object> map = new HashMap<String, Object>();
//				map = gson.fromJson(this.subQuestionnaireData, map.getClass());
//				System.out.println((String)map.get("questionnairename"));
				if(Tools.SaveQuestionnaire(udatas[4], this.subQuestionnaireData))
					session.getBasicRemote().sendText("c--Saved");
				else
					session.getBasicRemote().sendText("c--SaveFailed");
				this.subQuestionnaireData = "";
			}
//			System.out.println(map.get("questionnairename"));
		}else if(udatas[0].equals("m")){
//			
//			Map<String, Object> map = new HashMap<String, Object>();
//			map.put("questionnairename", "问卷名字");
//			map.put("submitnumbers", "999");
//			map.put("createdate", "2017-01-10");
//			map.put("qid", 0);
//			Map<String, Object> map2 = new HashMap<String, Object>();
//			map2.put("questionnairename", "问卷名字");
//			map2.put("submitnumbers", "999");
//			map2.put("createdate", "2017-01-10");
//			map2.put("qid", 0);
//			@SuppressWarnings("rawtypes")
//			Map[] maps = new Map[2];
//			maps[0] = map;
//			maps[1] = map2;
			ArrayList<Map> maps = Tools.Questionnaires();
			Gson gson = new Gson();
			String json = gson.toJson(maps);
//			System.out.println(json);
			session.getBasicRemote().sendText("m--" + json);
		}else if(udatas[0].equals("f")){
			
			String qnr = Tools.getQuestionnaire(Integer.parseInt(udatas[1]));
			if(qnr.equals("Deleted"))
				session.getBasicRemote().sendText("f--Deleted");
			else if(qnr.equals("None"))
				session.getBasicRemote().sendText("f--None");
			else {
				int a = (int)qnr.length() / 8000 + 1;
				for(int i = 0; i + 1 < a; i++)
					session.getBasicRemote().sendText("f--" + qnr.substring(0 + i * 8000, 8000 + i * 8000) + "--Wait");
				session.getBasicRemote().sendText("f--" + qnr.substring((a - 1) * 8000) + "--Finished");
			}

		}else if(udatas[0].equals("r")) {
			try {
				if(Tools.UserSubmit(udatas[1], udatas[2], udatas[3]))
					session.getBasicRemote().sendText("r--Succeed");
				else
					session.getBasicRemote().sendText("r--Failed");
			}catch(Exception e) {
				session.getBasicRemote().sendText("r--Failed");
			}
//			System.out.println(udatas[1]);
		}else if(udatas[0].equals("d")) {
			boolean bl = Tools.DeleteQueationnaire(Integer.parseInt(udatas[1]));
			if(bl)
				session.getBasicRemote().sendText("d--Succeed"); 
			else
				session.getBasicRemote().sendText("d--Failed"); 
		}else if(udatas[0].equals("e")) {
			//udatas[] 0 tag 1 qid 2 slice data 3 current slice 4 total slice 5 questionnairename
			this.subQuestionnaireData += udatas[2];
			if(udatas[4].equals(udatas[3])) {
//				Gson gson = new Gson();
//				Map<String, Object> map = new HashMap<String, Object>();
//				map = gson.fromJson(this.subQuestionnaireData, map.getClass());
//				System.out.println((String)map.get("questionnairename"));
				if(Tools.UpdateQueationnaire(Integer.parseInt(udatas[1]), udatas[5], this.subQuestionnaireData))
					session.getBasicRemote().sendText("e--Saved"); 
				else
					session.getBasicRemote().sendText("e--Failed"); 
			}
		}else if(udatas[0].equals("q")) {
			try {
				String pr = DataProcess.getProcessedResult(udatas[1]);
				if(pr != null) {
					int a = (int)pr.length() / 8000 + 1;
					for(int i = 0; i + 1 < a; i++)
						session.getBasicRemote().sendText("q--" + pr.substring(0 + i * 8000, 8000 + i * 8000) + "--Wait");
					session.getBasicRemote().sendText("q--" + pr.substring((a - 1) * 8000) + "--Finished");
				}
//					session.getBasicRemote().sendText("q--" + pr);
				else
					session.getBasicRemote().sendText("q--None");
			}catch(Exception e) {
				e.printStackTrace();
				session.getBasicRemote().sendText("q--None");
			}
		}else if(udatas[0].equals("g")) {
			String excelPath = GenerateExcel.getExcel(udatas[1]);
			if(excelPath.equals("Failed")) 
				session.getBasicRemote().sendText("g--Failed");
			else {
				session.getBasicRemote().sendText("g--" + excelPath);
			}
		}
			
	}

	@OnError
	public void onError(Session session, Throwable error) {
		error.printStackTrace();
	}
}