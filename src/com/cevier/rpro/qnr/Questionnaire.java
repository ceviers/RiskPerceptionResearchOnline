package com.cevier.rpro.qnr;

public class Questionnaire {
	private int QID;
	private String QName;
	private int SubmitNumber;
	private String CreateDate;
	
	/**
	 * Useless Class
	 * @param QID
	 * @param QName
	 * @param SubmitNumber
	 * @param CreateDate
	 */
	public Questionnaire(int QID, String QName, int SubmitNumber, String CreateDate) {
		this.QID = QID;
		this.QName = QName;
		this.SubmitNumber = SubmitNumber;
		this.CreateDate = CreateDate;
	}
	
	public int GetQID() {
		return this.QID;
	}
	
	public String GetQName() {
		return this.QName;
	}
	
	public int GetSubmitNumber() {
		return this.SubmitNumber;
	}
	
	public String GetCreateDate() {
		return this.CreateDate;
	}
}
