{...}: {
  languages.javascript.enable = true;
  services.postgres = {
    enable = true;
    listen_addresses = "localhost";
    port = 5432;
    initialDatabases = [
      {
        name = "inventory";
        user = "user";
        pass = "pass";
        schema = ./inventory.sql;
      }
    ];
  };
}
