package com.cevier.rpro.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Connect {

	public static Connection getMySQLConnection()
			throws SQLException, ClassNotFoundException {
		Class.forName("com.mysql.cj.jdbc.Driver");
		Connection conn = 
				DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/RPRO?useUnicode=true&characterEncoding=utf-8", 
						"user", "password");
		return conn;
	}
}