<?php
$data = [
    ["id" => "1", "msg" => "First Comment", "user" => "Naresh", "updatedOn" => "2014-09-19T15:28:46.493Z", "likes"=>5],
    ["id" => "2", "msg" => "Second Comment", "user" => "James", "updatedOn" => "2014-06-19T15:28:46.493Z", "likes"=>11],
    ["id" => "3", "msg" => "Third Comment", "user" => "Jack", "updatedOn" => "2014-12-19T15:28:46.493Z", "likes"=>5]];
header('Content-Type: application/json');
echo json_encode($data);