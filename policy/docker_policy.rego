package main

# Rule: Deny if the Dockerfile uses the 'latest' tag
deny[msg] {
    input[i].Cmd == "from"
    val := input[i].Value
    contains(val[0], ":latest")
    msg := sprintf("Do not use 'latest' tag in FROM: %v", [val[0]])
}

# Rule: Deny if the Dockerfile doesn't have a 'USER' command (runs as root)
deny[msg] {
    not any_user_command
    msg := "Security Risk: No 'USER' instruction found. Container will run as root."
}

any_user_command {
    input[i].Cmd == "user"
}
