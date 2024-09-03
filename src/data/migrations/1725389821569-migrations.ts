import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1725389821569 implements MigrationInterface {
    name = 'Migrations1725389821569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "deputees" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "parliamentGroupAcronym" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "parliamentGroups" ("acronym" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_deputees" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "parliamentGroupAcronym" varchar NOT NULL, CONSTRAINT "FK_c70ffd4c9535066adcedcea3cc2" FOREIGN KEY ("parliamentGroupAcronym") REFERENCES "parliamentGroups" ("acronym") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_deputees"("id", "name", "parliamentGroupAcronym") SELECT "id", "name", "parliamentGroupAcronym" FROM "deputees"`);
        await queryRunner.query(`DROP TABLE "deputees"`);
        await queryRunner.query(`ALTER TABLE "temporary_deputees" RENAME TO "deputees"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deputees" RENAME TO "temporary_deputees"`);
        await queryRunner.query(`CREATE TABLE "deputees" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "parliamentGroupAcronym" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "deputees"("id", "name", "parliamentGroupAcronym") SELECT "id", "name", "parliamentGroupAcronym" FROM "temporary_deputees"`);
        await queryRunner.query(`DROP TABLE "temporary_deputees"`);
        await queryRunner.query(`DROP TABLE "parliamentGroups"`);
        await queryRunner.query(`DROP TABLE "deputees"`);
    }

}
