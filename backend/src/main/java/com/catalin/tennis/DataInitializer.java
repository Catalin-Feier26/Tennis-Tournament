//package com.catalin.tennis;
//
//import com.catalin.tennis.dto.request.CreateMatchDTO;
//import com.catalin.tennis.dto.request.CreateTournamentDTO;
//import com.catalin.tennis.dto.request.RegistrationRequestDTO;
//import com.catalin.tennis.dto.request.RegisterUserDTO;
//import com.catalin.tennis.dto.response.MatchResponseDTO;
//import com.catalin.tennis.dto.response.TournamentResponseDTO;
//import com.catalin.tennis.dto.response.UserResponseDTO;
//import com.catalin.tennis.service.MatchService;
//import com.catalin.tennis.service.RegistrationService;
//import com.catalin.tennis.service.TournamentService;
//import com.catalin.tennis.service.UserService;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//
//@Component
//public class DataInitializer implements CommandLineRunner {
//
//    private final UserService userService;
//    private final TournamentService tournamentService;
//    private final MatchService matchService;
//    private final RegistrationService registrationService;
//
//    public DataInitializer(UserService userService,
//                           TournamentService tournamentService,
//                           MatchService matchService,
//                           RegistrationService registrationService) {
//        this.userService = userService;
//        this.tournamentService = tournamentService;
//        this.matchService = matchService;
//        this.registrationService = registrationService;
//    }
//
//    @Override
//    public void run(String... args) throws Exception {
//        System.out.println("Initializing sample data...");
//
//        // Create Users
//        UserResponseDTO player1 = userService.register(new RegisterUserDTO("player1", "password", "Player One"));
//        UserResponseDTO player2 = userService.register(new RegisterUserDTO("player2", "password", "Player Two"));
//        UserResponseDTO referee = userService.register(new RegisterUserDTO("referee1", "password", "Referee One"));
//
//        // Create a Tournament (starting in 10 days, ending in 20 days)
//        CreateTournamentDTO tournamentDTO = new CreateTournamentDTO("Championship",
//                LocalDate.now().plusDays(10), LocalDate.now().plusDays(20));
//        TournamentResponseDTO tournament = tournamentService.createTournament(tournamentDTO);
//
//        // Schedule a Match (for simplicity, we assume the generated IDs start at 1)
//        // CreateMatchDTO should contain the necessary IDs; adjust these values as needed.
//        CreateMatchDTO matchDTO = new CreateMatchDTO();
//        matchDTO.setPlayer1Id(1L); // assuming player1 gets ID 1
//        matchDTO.setPlayer2Id(2L); // assuming player2 gets ID 2
//        matchDTO.setRefereeId(3L); // assuming referee gets ID 3
//        matchDTO.setTournamentId(1L); // assuming tournament gets ID 1
//        matchDTO.setStartDate(LocalDateTime.now().plusDays(11)); // match scheduled 11 days from now
//
//        MatchResponseDTO match = matchService.createMatch(matchDTO);
//        System.out.println("Match scheduled: " + match);
//
//        // Register a player for the tournament
//        RegistrationRequestDTO regDTO = new RegistrationRequestDTO();
//        regDTO.setPlayerId(1L);         // player1 ID
//        regDTO.setTournamentId(1L);      // tournament ID
//        System.out.println("Player registration: " + registrationService.registerPlayer(regDTO));
//
//        System.out.println("Sample data initialization complete.");
//    }
//}
