//This Code Connects the code from Javascript Page functionalities to the backend UDP+Database
package com.gamemaster.controller;

import com.gamemaster.database.Database;
import com.gamemaster.udp.UdpManager;
import org.springframework.web.bind.annotation.*;
import jakarta.annotation.PostConstruct;

import java.io.IOException;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;

import java.util.concurrent.ConcurrentHashMap;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class ControllerMaster {

    private Database database;
    private UdpManager Udp;

    // hardware/equipment id = active player info
    //this is used to track which players are currently active in the game and their associated hardware ids for hit detection and team logic
    private final Map<Integer, ActivePlayer> activePlayersByHardware = new ConcurrentHashMap<>();

    public ControllerMaster(Database database, UdpManager Udp) {
        this.database = database;
        this.Udp = Udp;
    }

    public static class ActivePlayer {
        public int playerId;
        public String codename;
        public int hardwareId;
        public String team;

        public ActivePlayer() {}

        public ActivePlayer(int playerId, String codename, int hardwareId, String team) {
            this.playerId = playerId;
            this.codename = codename;
            this.hardwareId = hardwareId;
            this.team = team;
        }
    }

    @PostConstruct
    public void initReceiver() {
        Udp.startReceiverLoop(this::handleReceivedHit);
    }

    // Handle incoming UDP messages representing hits
    private void handleReceivedHit(String msg) {
        try {
            String[] parts = msg.trim().split(":");
            if (parts.length != 2) {
                System.out.println("Invalid UDP message: " + msg);
                return;
            }

            int shooterHw = Integer.parseInt(parts[0].trim());
            int targetHw = Integer.parseInt(parts[1].trim());

            ActivePlayer shooter = activePlayersByHardware.get(shooterHw);
            ActivePlayer target = activePlayersByHardware.get(targetHw);

            // If target is not a player, treat as normal single broadcast
            if (target == null) {
                Udp.broadcastInt(targetHw);
                System.out.println("Broadcast target/base code: " + targetHw);
                return;
            }

            if (shooter == null) {
                System.out.println("Unknown shooter hardware id: " + shooterHw);
                return;
            }

            // Friendly fire aka same team
            if (shooter.team.equalsIgnoreCase(target.team)) {
                Udp.broadcastInt(shooter.hardwareId);
                Udp.broadcastInt(target.hardwareId);

                System.out.println("Friendly fire detected: " +
                        shooter.hardwareId + " -> " + target.hardwareId);
            } else {
                // Normal hit
                Udp.broadcastInt(target.hardwareId);

                System.out.println("Normal hit: " +
                        shooter.hardwareId + " -> " + target.hardwareId);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PostMapping("/getPlayersThatExist")
    public List<String> getPlayersThatExist(@RequestBody List<String> players) {
        List<String> playerCodenames = new ArrayList<>();
        playerCodenames = this.database.getPlayersThatExist(players);
        return playerCodenames;
    }

    // new add all game players with hardware id + team the old way is just player id and codename, but we need hardware id and team for gameplay logic
    @PostMapping("/registerGamePlayers")
    public String registerGamePlayers(@RequestBody List<ActivePlayer> players) {
        activePlayersByHardware.clear();

        for (ActivePlayer p : players) {
            database.addPlayer(p.playerId, p.codename);
            activePlayersByHardware.put(p.hardwareId, p);

            try {
                Udp.broadcastInt(p.hardwareId);
            } catch (IOException e) {
                e.printStackTrace();
                return "Error transmitting equipment id " + p.hardwareId;
            }
        }

        return "Players registered successfully";
    }

    @PostMapping("/removePlayers")
    public int removePlayers(@RequestBody List<Integer> players) {
        int remover = 0;

        for (int i = 0; i < players.size(); i++) {
            remover = this.database.removePlayers(players.get(i));
        }

        // Also remove them from active in-memory gameplay map
        activePlayersByHardware.values().removeIf(p -> players.contains(p.playerId));

        return remover;
    }

    @PostMapping("/PrintPlayers")
    public void PrintPlayers() {
        this.database.printPlayers();
    }

    @PostMapping("/setNetworkAddress")
    public void setNetworkAddress(@RequestBody Map<String, String> body) {
        try {
            String address = body.get("address");
            Udp.setNetworkAddress(address);
            System.out.println("Current network address: " + Udp.getNetworkAddress().getHostAddress());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @PostMapping("/startGame")
    public String startGame() {
        try {
            Udp.broadcastInt(202);
            System.out.println("Broadcasted game start code: 202");
            return "Game started";
        } catch (IOException e) {
            e.printStackTrace();
            return "Error starting game";
        }
    }
}
