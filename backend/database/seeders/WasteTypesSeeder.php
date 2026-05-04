<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WasteTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('waste_types')->upsert([
            ['name' => 'Organic', 'description' => 'Rac huu co, thuc pham thua'],
            ['name' => 'Recyclable', 'description' => 'Rac co the tai che: giay, nhua, kim loai, thuy tinh'],
            ['name' => 'Hazardous', 'description' => 'Rac nguy hai: pin, hoa chat, thuoc'],
            ['name' => 'Bulky', 'description' => 'Rac cong kenh: do noi that, thiet bi lon'],
            ['name' => 'Electronic', 'description' => 'Rac dien tu: may tinh, dien thoai cu'],
            ['name' => 'Other', 'description' => 'Loai rac khac'],
        ], ['name'], ['description']);
    }
}
