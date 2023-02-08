<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockController extends Controller
{
    //
    public function lastStock()
    {
        $query = "SELECT stock.*, empresas.nombre FROM stock INNER JOIN empresas ON stock.empresas_id = empresas.id WHERE fecha=(SELECT MAX(fecha) AS 'Ultima fecha' FROM `stock`);";
        $data = DB::select($query);
        
        // Return the data as a JSON response
        return response()->json([
            'data' => $data
        ]);
    }
}
