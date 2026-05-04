<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ComplaintSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $citizenId = DB::table('users')->where('email', 'citizen@ecocollect.vn')->value('id');
        $requestId = DB::table('waste_requests')->where('citizen_id', $citizenId)->value('id');

        if (!$citizenId || !$requestId) return;

        DB::table('complaints')->updateOrInsert(
            ['citizen_id' => $citizenId, 'request_id' => $requestId],
            [
                'complaint_type' => 'complaint',
                'content' => 'Collector is late for the appointment.',
                'status' => 'pending',
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
