<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CitizenUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $citizenRoleId = DB::table('roles')->where('name', 'citizen')->value('id');
        $defaultWardId = DB::table('wards')->where('code', 'P7BT')->value('id');

        DB::table('users')->updateOrInsert(
            ['email' => 'citizen@ecocollect.vn'],
            [
                'role_id' => $citizenRoleId,
                'full_name' => 'Demo Citizen',
                'phone' => '0900000001',
                'password_hash' => Hash::make('citizen123'),
                'avatar_url' => null,
                'ward_id' => $defaultWardId,
                'is_active' => true,
                'is_deleted' => false,
                'remember_token' => Str::random(10),
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );
    }
}
