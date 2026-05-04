<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRoleId = DB::table('roles')->where('name', 'admin')->value('id');

        DB::table('users')->updateOrInsert(
            ['email' => 'admin@ecocollect.vn'],
            [
                'role_id' => $adminRoleId,
                'full_name' => 'System Admin',
                'phone' => '0900000000',
                'password_hash' => Hash::make('admin123'),
                'avatar_url' => null,
                'ward_id' => null,
                'is_active' => true,
                'is_deleted' => false,
                'remember_token' => Str::random(10),
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );
    }
}
