import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedInitiativeEntities1725389961963 implements MigrationInterface {
    name = 'AddedInitiativeEntities1725389961963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "events" ("id" varchar PRIMARY KEY NOT NULL, "date" varchar NOT NULL, "phase" varchar NOT NULL, "initiativeId" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "initiatives" ("id" varchar PRIMARY KEY NOT NULL, "startDate" varchar NOT NULL, "title" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "vote" ("id" varchar PRIMARY KEY NOT NULL, "result" varchar NOT NULL, "date" varchar NOT NULL, "details" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_events" ("id" varchar PRIMARY KEY NOT NULL, "date" varchar NOT NULL, "phase" varchar NOT NULL, "initiativeId" varchar NOT NULL, CONSTRAINT "FK_78ec9d5d7781e78f86a648b2bb5" FOREIGN KEY ("initiativeId") REFERENCES "initiatives" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_events"("id", "date", "phase", "initiativeId") SELECT "id", "date", "phase", "initiativeId" FROM "events"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`ALTER TABLE "temporary_events" RENAME TO "events"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" RENAME TO "temporary_events"`);
        await queryRunner.query(`CREATE TABLE "events" ("id" varchar PRIMARY KEY NOT NULL, "date" varchar NOT NULL, "phase" varchar NOT NULL, "initiativeId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "events"("id", "date", "phase", "initiativeId") SELECT "id", "date", "phase", "initiativeId" FROM "temporary_events"`);
        await queryRunner.query(`DROP TABLE "temporary_events"`);
        await queryRunner.query(`DROP TABLE "vote"`);
        await queryRunner.query(`DROP TABLE "initiatives"`);
        await queryRunner.query(`DROP TABLE "events"`);
    }

}
