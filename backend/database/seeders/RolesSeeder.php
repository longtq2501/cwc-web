<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('roles')->upsert([
            ['name' => 'citizen', 'description' => 'Nguoi dan bao cao rac'],
            ['name' => 'collector', 'description' => 'Nhan vien thu gom cua Enterprise'],
            ['name' => 'enterprise', 'description' => 'Tai khoan quan ly Recycling Enterprise'],
            ['name' => 'admin', 'description' => 'Quan tri vien he thong'],
        ], ['name'], ['description']);
    }
}
