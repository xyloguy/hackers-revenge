-- Generate 100 players using existing programs (unmodified)
-- This script creates new players and assigns them existing programs

SET @current_count = (SELECT COUNT(*) FROM players);
SET @target_count = 100;
SET @to_generate = @target_count - @current_count;

-- Get the list of existing program IDs
SET @existing_programs = (SELECT GROUP_CONCAT(id) FROM programs WHERE id IN (SELECT DISTINCT last_program_id FROM players WHERE last_program_id IS NOT NULL));

-- MySQL procedure to generate players
DELIMITER //

DROP PROCEDURE IF EXISTS generate_test_players//

CREATE PROCEDURE generate_test_players()
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE current_total INT;
    DECLARE program_ids_count INT;
    DECLARE random_program_id INT;
    DECLARE new_token VARCHAR(8);
    DECLARE new_name VARCHAR(100);

    -- Count existing players
    SELECT COUNT(*) INTO current_total FROM players;

    -- Count available programs
    SELECT COUNT(DISTINCT last_program_id) INTO program_ids_count
    FROM players
    WHERE last_program_id IS NOT NULL;

    SELECT CONCAT('Current players: ', current_total) AS status;
    SELECT CONCAT('Available programs: ', program_ids_count) AS status;

    -- Generate players up to 100
    WHILE current_total < 100 DO
        SET i = i + 1;

        -- Generate unique token
        SET new_token = LOWER(CONCAT(
            CHAR(97 + FLOOR(RAND() * 26)),
            CHAR(97 + FLOOR(RAND() * 26)),
            CHAR(97 + FLOOR(RAND() * 26)),
            CHAR(97 + FLOOR(RAND() * 26)),
            CHAR(97 + FLOOR(RAND() * 26)),
            CHAR(97 + FLOOR(RAND() * 26)),
            CHAR(97 + FLOOR(RAND() * 26)),
            CHAR(97 + FLOOR(RAND() * 26))
        ));

        -- Generate name
        SET new_name = CONCAT('TestPlayer', i);

        -- Pick a random existing program
        SELECT last_program_id INTO random_program_id
        FROM players
        WHERE last_program_id IS NOT NULL
        ORDER BY RAND()
        LIMIT 1;

        -- Insert new player
        INSERT INTO players (token, name, last_program_id, wins, losses, ties, score, created_at, updated_at)
        VALUES (new_token, new_name, random_program_id, 0, 0, 0, 0, NOW(), NOW());

        SET current_total = current_total + 1;

        IF i % 10 = 0 THEN
            SELECT CONCAT('Created ', i, ' players...') AS progress;
        END IF;
    END WHILE;

    SELECT CONCAT('Successfully created ', i, ' players') AS result;
    SELECT COUNT(*) AS total_players FROM players;
END//

DELIMITER ;

-- Run the procedure
CALL generate_test_players();

-- Show final stats
SELECT COUNT(*) AS total_players FROM players;
SELECT COUNT(*) AS players_with_programs FROM players WHERE last_program_id IS NOT NULL;
