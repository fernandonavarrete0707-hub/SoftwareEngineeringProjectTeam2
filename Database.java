//Database Class
//For Software Engineering
//With Professor Strother
//U of A Spring 2026
//By Gus harr


/*
            DATABASE CLASS


for interacting with the PostGreSQL Database
*/


import java.sql.*;



public class Database {

    //  VARS
    private static final String URL = "jdbc:postgresql:photon";
    private Connection connection;

    //  CONSTRUCTOR
    public Database() {
        //establish connection to the database
        try {
            this.connection = DriverManager.getConnection(URL, "student", "student");
            System.out.println("Connection to the database was successful!");
        }
        catch(SQLException e) {
            System.out.println("Could not connect to the database!");
            System.out.println(e.getMessage());
        }
    }

    //  ADD AND REMOVE
    //addPlayer method
    //params: id and name
    //creates a new player in the database with ID id and codename name.
    //returns true when a player is successfully added to the database, false otherwise
    public boolean addPlayer(int id, String name) {    
        try(PreparedStatement pstmt = this.connection.prepareStatement("INSERT INTO players (id, codename) VALUES (?, ?)")) {
            pstmt.setInt(1, id);
            pstmt.setString(2, name);
            pstmt.executeUpdate();
            
            return true;
        }

        catch(SQLException e) {
            System.err.println("SQL exception occurred whille attempting to add a user: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    //removePlayers methods
    //ID version
    //params: id
    //removes players from the database with the given id
    //returns the number of players removed from the database
    public int removePlayers(int id) {
        int updated = 0;

        //attempting to remove all users with matching id
        try(PreparedStatement pstmt = this.connection.prepareStatement("DELETE FROM players WHERE id = ?")) {
            pstmt.setInt(1, id);
            updated = pstmt.executeUpdate();
        }

        catch(SQLException e) {
            System.err.println("SQL exception occurred whille attempting to remove users: " + e.getMessage());
            e.printStackTrace();
        }

        //printing and returning results
        System.out.println();
        System.out.println(updated == 1 ? "An entry was removed from the table." : updated + " entries were removed from the table.");
        return updated;
    }

    //Codename version
    //params: name
    //removes players from the database with the given codename
    //returns the number of players removed from the database
    public int removePlayers(String name) {
        int updated = 0;

        //attempting to remove all users with matching codename
        try(PreparedStatement pstmt = this.connection.prepareStatement("DELETE FROM players WHERE codename = ?")) {
            pstmt.setString(1, name);
            updated = pstmt.executeUpdate();
        }

        catch(SQLException e) {
            System.err.println("SQL exception occurred whille attempting to remove users: " + e.getMessage());
            e.printStackTrace();
        }

        //printing and returning results
        System.out.println();
        System.out.println(updated == 1 ? "An entry was removed from the table." : updated + " entries were removed from the table");
        return updated;
    }

    //full version
    //params: id and codename 
    //removes players from the database with the given id and codename combination
    //returns the number of players removed from the database
    public int removePlayers(int id, String name) {
        int updated = 0;

        //attempting to remove all users with matching id and codename
        try(PreparedStatement pstmt = this.connection.prepareStatement("DELETE FROM players WHERE id = ? AND codename = ?")) {
            pstmt.setInt(1, id);
            pstmt.setString(2, name);
            updated = pstmt.executeUpdate();
        }

        catch(SQLException e) {
            System.err.println("SQL exception occurred whille attempting to remove users: " + e.getMessage());
            e.printStackTrace();
        }

        //printing and returning results
        System.out.println();
        System.out.println(updated == 1 ? "An entry was removed from the table." : updated + " entries were removed from the table");
        return updated;
    }




    //printPlayers method
    public void printPlayers() {
        //fetching data from table
        try(Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM players")) {

            //getting column data
            ResultSetMetaData rsmd = rs.getMetaData();
            int colsCount = rsmd.getColumnCount();
            
            //printing data
            System.out.println("\n\n");
            System.out.println("Player list:");
            System.out.printf("%-10s", "ID:");
            System.out.printf("%-10s", "Codename:");
            System.out.println();

            
            while(rs.next()) {
                for (int i = 1; i <= colsCount; i++) {
                    System.out.printf("%-10s", rs.getString(i));
                }
                System.out.println();
            }
        }
        catch(SQLException e) {
            System.err.println("SQL exception occurred whille attempting to print users: " + e.getMessage());
            e.printStackTrace();
        }
        
    }
}