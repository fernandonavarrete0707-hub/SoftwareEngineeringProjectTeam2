public class test {

    public static void main(String[] args) {
        Database data = new Database();
        data.removePlayers(2);
        data.removePlayers(3);
        data.printPlayers();
        data.addPlayer(2, "Alpha");
        data.addPlayer(3, "Bravo");
        data.printPlayers();
    }
}