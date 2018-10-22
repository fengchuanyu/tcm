<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use QCloud_WeApp_SDK\Mysql\Mysql as DB;
class Infor_model extends CI_Model {
  
    public function get_doctor_list()
    {
       return DB::select('doctor', ['*']);
      // $sql="select * from article";
			// $query=$this->db->query($sql);
			// return $query->row();
    } 
    public function get_article_list()
    {
       return DB::select('article', ['*']);
    } 
    public function get_article_only(){
      $pdo = DB::getInstance(); 
      // $query = $pdo->query("select * from article where article.aid = 2"); 
      $query = $pdo->query("select * from article,doctor,ill-class where article.aid=2 and doctor.did = article.article_id and article.article_class = ill-class.iid") 
      return $query->fetchAll(); 
      // return DB::select('article', ['*']);
    }
    public function get_illnesslist_list()
    {
       return DB::select('ill-class', ['*']);
    } 
    public function add_reg_list($name,$id,$did,$time)
    {
       return DB::insert('registration', ['r_uid' => $name, 'r_did' => $did, 'r_time' => $time, 'r_tag' =>1]); 
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
}
