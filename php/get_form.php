<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Details</title>
</head>
<body>
    <h1>Welcome </h1>
    <?php
        $un = $_GET["userName"];
        $pass = $_GET["pass"];
        $email = $_GET["email"];
        if ($un == "asaf") { 
            echo "<h2>" . $un . "</h2> <br> <h3>Your passward is: " . $pass . "<br> Your E-mail is: " . $email . "</h3>";
            echo"<p> Your last log in: " . date("d-m-y",time()) . "</p>" ;
        }
        else echo "<h1> Invalid user name.</h1>";
    ?>

</body>
</html>
