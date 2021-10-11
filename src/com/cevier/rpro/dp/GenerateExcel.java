package com.cevier.rpro.dp;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.cevier.rpro.db.Tools;
import com.google.gson.Gson;

import jxl.Workbook;
import jxl.format.Alignment;
import jxl.format.VerticalAlignment;
import jxl.write.Label;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

public class GenerateExcel {
	
	public static void main(String[] args) throws IOException {
		// TODO Auto-generated method stub
//		System.out.println(GenerateExcel.getExcel("24"));
	}
	
	/**
	 * 
	 * @param QID
	 * @return String Excel File Path
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public static String getExcel(String QID) {
		try {
			
			boolean createTag = true;//Ĭ��ʱ������  ��Ҫ��������
			
			String prePath = GenerateExcel.class.getResource("").toString();
			String path = "/" + prePath.substring(6, prePath.length() - 35) + "Download/";
			
			SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmm");
			String crttime = format.format(new Date());

			String oldPath = "";
			File file = new File(path);
			File[] tempList = file.listFiles(); //�����ļ����ļ���
			for (int i = 0; i < tempList.length; i++) {
				if (tempList[i].isFile()) {//�ж��Ƿ�Ϊ�ļ�
					if(tempList[i].toString().contains("Q" + QID)) {//tempList[i].toString() �ļ�·��
						int ct1 = Integer.parseInt(crttime.substring(0, 8));
						oldPath = tempList[i].toString();
						int opathsize = oldPath.length();
						int st1 = Integer.parseInt(oldPath.substring(opathsize - 16, opathsize -8));
						
						if(ct1 - st1 == 0) {//����
							int tInterval = Integer.parseInt(crttime.substring(8, 10)) * 60 
									+ Integer.parseInt(crttime.substring(10, 12)) 
									- Integer.parseInt(oldPath.substring(opathsize - 8, opathsize - 6)) * 60 
									- Integer.parseInt(oldPath.substring(opathsize - 6, opathsize - 4));
							if(tInterval < 3)
								createTag = false;
						}else if(ct1 - st1 == 1) {//����
							int tInterval = 24 * 60 + Integer.parseInt(crttime.substring(8, 10)) * 60 
									+ Integer.parseInt(crttime.substring(10, 12)) 
									- Integer.parseInt(oldPath.substring(opathsize - 8, opathsize - 6)) * 60 
									- Integer.parseInt(oldPath.substring(opathsize - 6, opathsize - 4));
							if(tInterval > 3)
								createTag = false;
						}
						
						if(createTag)
							tempList[i].delete();
						break;
					}
				}
				if(i == tempList.length -1 && !createTag)
					createTag = true;
			}
			
			if(createTag) {
				WritableWorkbook book = Workbook.createWorkbook( new File( path + "Q" + QID + crttime + ".xls"));
				WritableSheet sheet = book.createSheet( "Page One" , 0 );
				
				WritableFont font1 = new WritableFont(WritableFont.createFont("����"), 15, WritableFont.BOLD);
				WritableCellFormat fontFormat1 = new WritableCellFormat(font1);
				fontFormat1.setAlignment(Alignment.CENTRE);
				fontFormat1.setVerticalAlignment(VerticalAlignment.CENTRE);
				fontFormat1.setWrap(true);
				
				WritableFont font2 = new WritableFont(WritableFont.createFont("����"), 15);
				WritableCellFormat fontFormat2 = new WritableCellFormat(font2);
				fontFormat2.setAlignment(Alignment.CENTRE);
				fontFormat2.setVerticalAlignment(VerticalAlignment.CENTRE);
				fontFormat2.setWrap(true);
				
				//��ȡ��������ʾ���
				String qnr = Tools.getQuestionnaire(Integer.parseInt(QID));
				Gson gson = new Gson();
				Map<String, Object> map = new HashMap<String, Object>();
				map = gson.fromJson(qnr, map.getClass());
				
				ArrayList<Map> questionList= (ArrayList<Map>) map.get("questions");//������
				
				for(int i = 0; i < questionList.size(); i++) { //(String) questionList.get(i).get("qname") ����i
					Label label = new Label( i, 0, (String) questionList.get(i).get("qname"), fontFormat1);
					sheet.addCell(label);
				}
				
				//����ѡ����
				ArrayList<String> UserAsrs = Tools.getRawResult(QID);//UserAsrs �û���ѡ��
				if(UserAsrs != null) {
					for(int i = 0; i < UserAsrs.size(); i++) {
						ArrayList<String> oneUserAsr = gson.fromJson(UserAsrs.get(i), UserAsrs.getClass());//oneUserAsr��i�û���ѡ��
						String[] oneAsr = new String[oneUserAsr.size()];
						for(int j = 0; j < oneUserAsr.size(); j++) {
							ArrayList<Map> optionList = (ArrayList<Map>) questionList.get(j).get("qoption");
							//�����ѡ
							String asrStr = oneUserAsr.get(j);//�û���j������� 
							if(asrStr != null) {
								for(int k = 1; k < asrStr.length(); k++) {//oneAsr[j]��j��Ĵ�
									char charAsrStr = oneUserAsr.get(j).charAt(k);
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
										break;//����u˵��һ��ѡ������ɣ�����ѭ��
									}
								}
								Label label = new Label( j, i + 1, oneAsr[j], fontFormat2);
								sheet.addCell(label);
							}
						}
					}
				}
				
				book.write();
				book.close();
				
				return "./Download/Q" + QID + crttime + ".xls";
			}else {
				return "./Download/" + oldPath.substring(path.length());
			}
				
		}catch(Exception e) {
			e.printStackTrace();
			return "Failed";
		}
	}
}
