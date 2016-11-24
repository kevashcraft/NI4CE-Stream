<?php

$config = file_get_contents(__DIR__ . '/config.json');
$config = json_decode($config);

$data = new stdClass();

$data->site = $config->site;

$data->favicons = file_get_contents(__DIR__ . '/../static/favicons/index.html');

$data = json_encode($data);

$file = fopen(__DIR__ . '/../data.json', 'w');
fwrite($file, $data);
fclose($file);
