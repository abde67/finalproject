import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class TestDB {
    public static void main(String[] args) {
        try {
            // Load MySQL JDBC Driver
Class.forName("com.mysql.cj.jdbc.Driver");

            String url = "jdbc:mysql://localhost:3306/testdb?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC";
            String user = "root";
            String password = "pokoloko123!";

            Connection conn = DriverManager.getConnection(url, user, password);
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM students"); // your table

            while(rs.next()) {
                System.out.println("ID: " + rs.getInt("id") + ", Name: " + rs.getString("name"));
            }

            rs.close();
            stmt.close();
            conn.close();
            System.out.println("Connection successful!");
        } catch(Exception e) {
            e.printStackTrace();
        }
    }
}
