<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Login</title>
</head>
<body>
    <section>
        Welcome
        <?php
            $username = $_GET["fullName"];
            $password = $_GET["pass"];
            if ($username == "asaf" && $password == "111") {
                echo "<h2>Good morning user " . $username . "</h2>";
            } else {
                echo "<h2> Who are you? You can't get in</h2>";
            }
        ?>
    </section>
</body>
</html>