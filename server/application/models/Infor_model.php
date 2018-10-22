<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use QCloud_WeApp_SDK\Mysql\Mysql as DB;
class Infor_model extends CI_Model {
  
    public function get_doctor_list()
    {
       return DB::select('doctor', ['*']);
    } 
    public function get_article_list()
    {
       return DB::select('article', ['*']);
    } 
    public function get_article_ill(){
      $pdo = DB::getInstance(); 
      $query = $pdo->query("select * from article,illclass,doctor where illclass.iid = article.article_class and doctor.did = article.article_id"); 
      return $query->fetchAll(); 
    }
    public function get_illnesslist_list()
    {
       return DB::select('illclass', ['*']);
    } 
    public function add_reg_list($name,$ID,$did,$uid,$time)
    {
       return DB::insert('registration', ['r_uid' => $uid, 'r_did' => $did, 'r_time' => $time, 'r_tag' =>1, 'r_name' => $name, 'r_numberID' => $ID]); 
    } 
    public function insert_user($id)
    {
       return DB::insert('users', ['option_id' => $id]);
    } 
    public function select_user_list($id){
      return DB::select('users', ['*'],['option_id' => $id]);
    }
     public function insert_collect($aid,$uid,$time)
    {
       return DB::insert('collect',['collect_uid' => $uid, 'collect_aid' => $aid, 'collect_time' => $time]);
    } 
     public function delete_collect($aid,$uid)
    {
       return DB::delete('collect',['collect_uid' => $uid, 'collect_aid' => $aid]);
    } 
    public function update_user($uid,$name,$ID,$phone,$bir,$sex){
      return DB::update('users',['user_name' => $name, 'user_phone' => $phone, 'user_idnumber' => $ID, 'user_sex' => $sex, 'user_birth' => $bir],['uid' => $uid]);
    }
}
