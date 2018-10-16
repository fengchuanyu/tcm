<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Infor extends CI_Controller {
 
  public function get_doctor_list()
    {
        $this -> load -> model('Infor_model');
        $result = $this -> Infor_model -> get_list();
        echo json_encode($result);
    }
}