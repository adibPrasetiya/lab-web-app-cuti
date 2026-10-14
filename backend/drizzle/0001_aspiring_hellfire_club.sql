CREATE TABLE `leave_requests` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`jenis` enum('tahunan','sakit','penting') NOT NULL,
	`start_date` date NOT NULL,
	`end_date` date NOT NULL,
	`alasan` varchar(500) NOT NULL,
	`attachment_filename` varchar(255) NOT NULL,
	`attachment_original_name` varchar(255) NOT NULL,
	`attachment_mime` varchar(150) NOT NULL,
	`status` enum('menunggu_atasan','menunggu_admin','disetujui','ditolak') NOT NULL DEFAULT 'menunggu_atasan',
	`ditolak_oleh` enum('atasan','admin'),
	`atasan_id` bigint unsigned,
	`atasan_note` varchar(500),
	`atasan_acted_at` datetime,
	`admin_id` bigint unsigned,
	`admin_note` varchar(500),
	`admin_acted_at` datetime,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `leave_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `leave_requests` ADD CONSTRAINT `leave_requests_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leave_requests` ADD CONSTRAINT `leave_requests_atasan_id_users_id_fk` FOREIGN KEY (`atasan_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leave_requests` ADD CONSTRAINT `leave_requests_admin_id_users_id_fk` FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;