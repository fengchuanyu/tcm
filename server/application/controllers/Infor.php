<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Infor extends CI_Controller {
 
  public function get_doctor()
    {
        $this -> load -> model('Infor_model');
        $result = $this -> Infor_model -> get_doctor_list();
        echo json_encode($result);
    }
    public function get_article()
    {
        $this -> load -> model('Infor_model');
        $result = $this -> Infor_model -> get_article_list();
        echo json_encode($result);
    }
    public function get_article_only(){
      $this -> load -> model('Infor_model');
      $result = $this -> Infor_model -> get_article_only();
      echo json_encode($result);
    }
    public function get_illnesslist()
    {
        $this -> load -> model('Infor_model');
        $result = $this -> Infor_model -> get_illnesslist_list();
        echo json_encode($result);
    }
    public function add_reg()
    {
        $name = $this->input->get('name');
        $id = $this->input->get('id');
        $did = $this->input->get('did');
        $time = $this->input->get('nowtime');
        $this -> load -> model('Infor_model');
        $result = $this -> Infor_model -> add_reg_list($name,$id,$did,$time);
        echo json_encode($result);
    }

    public function select_user(){
      $id = $this->input->get('openid');
      $this -> load -> model('Infor_model');
      $result = $this -> Infor_model -> select_user_list($id);
      echo json_encode($result);
    }
    public function insert_user(){
      $id = $this->input->get('openid');
      $this -> load -> model('Infor_model');
      $result = $this -> Infor_model -> insert_user($id);
      echo json_encode($result);
    }
    public function add_collect(){
      $aid = $this->input->get('aid');
      $uid = $this->input->get('uid');
      $time = $this->input->get('time');
      $this -> load -> model('Infor_model');
      $result = $this -> Infor_model -> insert_collect($aid,$uid,$time);
      echo json_encode($result);
    }
}