<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GeographySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('provinces')->updateOrInsert(
            ['code' => 'HCM'],
            ['name' => 'TP. Ho Chi Minh']
        );
        $hcmId = DB::table('provinces')->where('code', 'HCM')->value('id');

        DB::table('districts')->updateOrInsert(
            ['code' => 'QBT'],
            ['province_id' => $hcmId, 'name' => 'Quan Binh Thanh']
        );
        DB::table('districts')->updateOrInsert(
            ['code' => 'QTB'],
            ['province_id' => $hcmId, 'name' => 'Quan Tan Binh']
        );

        $binhThanhId = DB::table('districts')->where('code', 'QBT')->value('id');
        $tanBinhId = DB::table('districts')->where('code', 'QTB')->value('id');

        DB::table('wards')->updateOrInsert(
            ['code' => 'P7BT'],
            ['district_id' => $binhThanhId, 'name' => 'Phuong 7']
        );
        DB::table('wards')->updateOrInsert(
            ['code' => 'P3TB'],
            ['district_id' => $tanBinhId, 'name' => 'Phuong 3']
        );
        DB::table('wards')->updateOrInsert(
            ['code' => 'P12TB'],
            ['district_id' => $tanBinhId, 'name' => 'Phuong 12']
        );
    }
}
