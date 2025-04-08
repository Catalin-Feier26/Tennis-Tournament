
    create table match_sets (
        player1games integer,
        player2games integer,
        match_id bigint not null
    ) engine=InnoDB;

    create table matches (
        court_number integer not null,
        match_id bigint not null auto_increment,
        player1_id bigint not null,
        player2_id bigint not null,
        referee_id bigint not null,
        start_date datetime(6) not null,
        tournament_id bigint not null,
        primary key (match_id)
    ) engine=InnoDB;

    create table registrations (
        player_id bigint not null,
        registration_date datetime(6) not null,
        registration_id bigint not null auto_increment,
        tournament_id bigint not null,
        primary key (registration_id)
    ) engine=InnoDB;

    create table tournaments (
        end_date date not null,
        max_participants integer not null,
        registration_deadline date,
        start_date date not null,
        tournament_id bigint not null auto_increment,
        tournament_name varchar(255) not null,
        primary key (tournament_id)
    ) engine=InnoDB;

    create table users (
        created_at datetime(6) not null,
        user_id bigint not null auto_increment,
        name varchar(255) not null,
        password_hash varchar(255) not null,
        user_role enum ('ADMINISTRATOR','REFEREE','TENNIS_PLAYER') not null,
        username varchar(255) not null,
        primary key (user_id)
    ) engine=InnoDB;

    alter table tournaments 
       add constraint UK_13yjn6c7tgn3o864dhfdjx7yj unique (tournament_name);

    alter table users 
       add constraint UK_r43af9ap4edm43mmtq01oddj6 unique (username);

    alter table match_sets 
       add constraint FK8h905anwua91wjx96ud74uj62 
       foreign key (match_id) 
       references matches (match_id);

    alter table matches 
       add constraint FK399aa3d3u7tilrrvtuj396nuj 
       foreign key (player1_id) 
       references users (user_id);

    alter table matches 
       add constraint FKf9p2o4y87q9pjb8dgn34np8wk 
       foreign key (player2_id) 
       references users (user_id);

    alter table matches 
       add constraint FKjefeporn1y6kfowpanuya6b69 
       foreign key (referee_id) 
       references users (user_id);

    alter table matches 
       add constraint FKeeniokyjgo5k6rmhjujatn27i 
       foreign key (tournament_id) 
       references tournaments (tournament_id);

    alter table registrations 
       add constraint FKury7obbuqofkiefr2jxkcewf 
       foreign key (player_id) 
       references users (user_id);

    alter table registrations 
       add constraint FKt7v16jbn0b1ox6xc3vla3g365 
       foreign key (tournament_id) 
       references tournaments (tournament_id);
