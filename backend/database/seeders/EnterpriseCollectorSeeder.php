<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class EnterpriseCollectorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $enterpriseRoleId = DB::table('roles')->where('name', 'enterprise')->value('id');
        $collectorRoleId = DB::table('roles')->where('name', 'collector')->value('id');
        $adminId = DB::table('users')->where('email', 'admin@ecocollect.vn')->value('id');
        $wardId = DB::table('wards')->where('code', 'P7BT')->value('id');

        DB::table('users')->updateOrInsert(
            ['email' => 'enterprise@ecocollect.vn'],
            [
                'role_id' => $enterpriseRoleId,
                'full_name' => 'Demo Enterprise Owner',
                'phone' => '0900000002',
                'password_hash' => Hash::make('enterprise123'),
                'ward_id' => $wardId,
                'is_active' => true,
                'is_deleted' => false,
                'remember_token' => Str::random(10),
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        $enterpriseUserId = DB::table('users')->where('email', 'enterprise@ecocollect.vn')->value('id');

        DB::table('recycling_enterprises')->updateOrInsert(
            ['user_id' => $enterpriseUserId],
            [
                'enterprise_name' => 'Eco Collect JSC',
                'license_number' => 'ECO-2026-001',
                'description' => 'Demo enterprise',
                'address' => '123 Enterprise Street',
                'ward_id' => $wardId,
                'status' => 'approved',
                'approved_at' => now(),
                'approved_by' => $adminId,
                'is_deleted' => false,
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        $enterpriseId = DB::table('recycling_enterprises')->where('user_id', $enterpriseUserId)->value('id');

        DB::table('enterprise_service_areas')->updateOrInsert(
            [
                'enterprise_id' => $enterpriseId,
                'ward_id' => $wardId,
            ],
            [
                'created_at' => now(),
            ]
        );

        $wasteTypeId = DB::table('waste_types')->where('name', 'Organic')->value('id');
        DB::table('enterprise_capabilities')->updateOrInsert(
            [
                'enterprise_id' => $enterpriseId,
                'waste_type_id' => $wasteTypeId,
            ],
            [
                'max_capacity_kg' => 1000,
                'notes' => 'Demo capacity',
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        DB::table('users')->updateOrInsert(
            ['email' => 'collector@ecocollect.vn'],
            [
                'role_id' => $collectorRoleId,
                'full_name' => 'Demo Collector',
                'phone' => '0900000003',
                'password_hash' => Hash::make('collector123'),
                'ward_id' => $wardId,
                'is_active' => true,
                'is_deleted' => false,
                'remember_token' => Str::random(10),
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        DB::table('users')->updateOrInsert(
            ['email' => 'enterprise.pending@ecocollect.vn'],
            [
                'role_id' => $enterpriseRoleId,
                'full_name' => 'Pending Enterprise Owner',
                'phone' => '0900000012',
                'password_hash' => Hash::make('enterprise123'),
                'ward_id' => $wardId,
                'is_active' => true,
                'is_deleted' => false,
                'remember_token' => Str::random(10),
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        $pendingEnterpriseUserId = DB::table('users')->where('email', 'enterprise.pending@ecocollect.vn')->value('id');

        DB::table('recycling_enterprises')->updateOrInsert(
            ['user_id' => $pendingEnterpriseUserId],
            [
                'enterprise_name' => 'Pending Eco Partner',
                'license_number' => 'ECO-2026-PENDING',
                'description' => 'Waiting for admin approval',
                'address' => '456 Pending Street',
                'ward_id' => $wardId,
                'status' => 'pending',
                'approved_at' => null,
                'approved_by' => null,
                'is_deleted' => false,
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        $collectorUserId = DB::table('users')->where('email', 'collector@ecocollect.vn')->value('id');

        DB::table('collectors')->updateOrInsert(
            ['user_id' => $collectorUserId],
            [
                'enterprise_id' => $enterpriseId,
                'vehicle_info' => 'Truck 51A-12345',
                'status' => 'active',
                'joined_at' => now()->toDateString(),
                'is_deleted' => false,
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );
    }
}
