import { getCustomRepository, getRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import { Request, Response } from "express";
import SendMailService from "../services/SendMailService";
import { resolve } from 'path';
import * as Yup from "yup"
import { AppError } from "../errors/AppError";

class SendMailController {

  async execute(request: Request, response: Response){
    const { email, survey_id } = request.body;

    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      survey_id: Yup.string().required()
  })

  try {
      await schema.validate(request.body, { abortEarly: false })
  } catch (error) {
      throw new AppError(error)
  }

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({ email });

    if(!user) {
      throw new AppError("User does not exists!");
    }

    const survey = await surveysRepository.findOne({ id: survey_id });
    const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

    if(!survey) {
      throw new AppError("Survey does not exists!");
    }

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: {user_id: user.id, value: null},
      relations: ["user", "survey"],
    });

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: "",
      link: process.env.URL_MAIL,
    };

    if(surveyUserAlreadyExists) {
      variables.id = surveyUserAlreadyExists.id,
      await SendMailService.execute(email, survey.title, variables, npsPath);

      return response.json(surveyUserAlreadyExists);
    }

    // Salvar as informações na tabela surveyUser
    const surveyUser = surveysUsersRepository.create({
      user_id: user.id, 
      survey_id
    })
    
    await surveysUsersRepository.save(surveyUser);
    // Enviar e-mail para o usuário
    variables.id = surveyUser.id;
    await SendMailService.execute(email, survey.title, variables, npsPath);

    return response.json(surveyUser);
  }
}

export{ SendMailController };