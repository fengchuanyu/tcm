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
    public function get_illnesslist_list()
    {
       return DB::select('ill-class', ['*']);
    } 

    public function add_reg_list($name,$id,$did,$time)
    {
       return DB::insert('registration', ['r_uid' => $name, 'r_did' => $did, 'r_time' => $time, 'r_tag' =>1]);
       
    } 
}
