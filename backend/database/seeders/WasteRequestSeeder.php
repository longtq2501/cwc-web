<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WasteRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $citizenId = DB::table('users')->where('email', 'citizen@ecocollect.vn')->value('id');
        $wasteTypeId = DB::table('waste_types')->where('name', 'Organic')->value('id');
        $wardId = DB::table('wards')->where('code', 'P7BT')->value('id');

        if (!$citizenId) return;

        DB::table('waste_requests')->updateOrInsert(
            ['citizen_id' => $citizenId, 'description' => 'Organic waste near my house'],
            [
                'waste_type_id' => $wasteTypeId,
                'ward_id' => $wardId,
                'address_detail' => '789 Citizen Street',
                'latitude' => 10.762622,
                'longitude' => 106.660172,
                'estimated_weight_kg' => 5.5,
                'status' => 'pending',
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $requestId = DB::table('waste_requests')->where('citizen_id', $citizenId)->orderByDesc('id')->value('id');

        DB::table('request_images')->updateOrInsert(
            ['request_id' => $requestId],
            [
                'image_url' => 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=1000',
                'is_primary' => true,
                'uploaded_at' => now(),
            ]
        );
    }
}
