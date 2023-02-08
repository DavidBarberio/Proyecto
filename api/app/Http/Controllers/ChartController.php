<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChartController extends Controller
{
    //
    public function stockYear()
    {
        $query = "SELECT t2.id, t2.nombre, AVG(t1.valor) as media_valor, DATE_FORMAT(t1.fecha, '%m') as mes 
        FROM stock t1 
        JOIN empresas t2 ON t2.id = t1.empresas_id 
        GROUP BY t1.empresas_id, mes 
        ORDER BY t1.empresas_id, mes;";
        $data = DB::select($query);
        
        // Return the data as a JSON response
        return response()->json([
            'data' => $data
        ]);
    }

    public function stockMonth()
    {
        $query = "SELECT t2.id, t2.nombre, MAX(t1.valor) as valor, DATE(t1.fecha) as fecha
        FROM stock t1
        JOIN empresas t2 ON t2.id = t1.empresas_id
        WHERE t1.fecha >= NOW() - INTERVAL 1 MONTH
        GROUP BY t1.empresas_id, DATE(t1.fecha)
        ORDER BY t1.empresas_id, fecha;";
        $data = DB::select($query);
        
        // Return the data as a JSON response
        return response()->json([
            'data' => $data
        ]);
    }

    public function stockWeek()
    {
        $query = "SELECT t2.id, t2.nombre, MAX(t1.valor) as valor, DATE(t1.fecha) as fecha
        FROM stock t1
        JOIN empresas t2 ON t2.id = t1.empresas_id
        WHERE t1.fecha >= NOW() - INTERVAL 1 WEEK
        GROUP BY t1.empresas_id, DATE(t1.fecha)
        ORDER BY t1.empresas_id, fecha;";
        $data = DB::select($query);
        
        // Return the data as a JSON response
        return response()->json([
            'data' => $data
        ]);
    }
}
