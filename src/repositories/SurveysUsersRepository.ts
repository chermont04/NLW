import { EntityRepository, Repository } from "typeorm";
import { SurveyUser } from "../models/surveuUser";

@EntityRepository(SurveyUser)
class SurveysUsersRepository extends Repository<SurveyUser> {}

export { SurveysUsersRepository };