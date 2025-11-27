package com.diseno.tpDiseno.dto.response;
import java.util.List;

import com.diseno.tpDiseno.dto.HuespedDTO;


import lombok.Data;


@Data
public class BuscarHuespedResponse {
  List<HuespedDTO> huespedes;
  ResultadoOperacion resultadoOperacion;

  public void setHuespedes(List<HuespedDTO> huespedes2) {
    this.huespedes = huespedes2;
  }
}