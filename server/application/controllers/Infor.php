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
    public function get_article_ill(){
      $this -> load -> model('Infor_model');
      $result = $this -> Infor_model -> get_article_ill();
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
        $ID = $this->input->get('ID');
        $did = $this->input->get('did');
        $uid = $this->input->get('uid');
        $time = $this->input->get('nowtime');
        $this -> load -> model('Infor_model');
        $result = $this -> Infor_model -> add_reg_list($name,$ID,$did,$uid,$time);
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
    public function delete_collect(){
      $aid = $this->input->get('aid');
      $uid = $this->input->get('uid');
      $this -> load -> model('Infor_model');
      $result = $this -> Infor_model -> delete_collect($aid,$uid);
      echo json_encode($result);
    }
    public function update_user(){
      $uid = $this->input->get('uid');
      $name = $this->input->get('name');
      $ID = $this->input->get('ID');
      $phone = $this->input->get('phone');
      $bir = $this->input->get('bir');
      $sex = $this->input->get('sex');
      $this -> load -> model('Infor_model');
      $result = $this -> Infor_model -> update_user($uid,$name,$ID,$phone,$bir,$sex);
      echo json_encode($result);
    }
    public function get_reg(){
      $uid = $this->input->get('uid');
      $this -> load -> model('Infor_model');
      $result = $this -> Infor_model -> select_reg($uid);
      echo json_encode($result);
    }
     public function get_col(){
      $uid = $this->input->get('uid');
      $this -> load -> model('Infor_model');
      $result = $this -> Infor_model -> get_col($uid);
      echo json_encode($result);
    }
    public function select_col(){
      $uid = $this->input->get('uid');
      $aid = $this->input->get('aid');
      $this -> load -> model('Infor_model');
      $result = $this -> Infor_model -> select_col($uid,$aid);
      echo json_encode($result);
    }
    public function del_reg(){
      $rid = $this->input->get('rid');
      $this -> load -> model('Infor_model');
      $result = $this -> Infor_model -> del_reg($rid);
      echo json_encode($result);
    }
}