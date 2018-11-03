<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{title}}</title>
    <style>
        body {
            margin: 30px;

        }

        a {
            font-family: '微软雅黑';
            display: block;
            font-size: 30px;
        }
    </style>
</head>

<body>
    <ul>
        {{#each files}}
        <li>
            <a href="{{../dir}}/{{this}}">{{this}}</a>
        </li>
        {{/each}}
    </ul>
</body>

</html>