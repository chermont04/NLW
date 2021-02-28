import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import * as Yup from "yup"
import { AppError } from "../errors/AppError"

class SurveysController {
  async create(request: Request, response: Response) {
    const { title, description } = request.body;

    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required()
    });

    try {
      await schema.validate(request.body, { abortEarly: false })
  } catch (error) {
      throw new AppError(error)
  }

    const surveysRepository = getCustomRepository(SurveysRepository);

    const survey = surveysRepository.create({
      title,
      description
    });

    await surveysRepository.save(survey);

    return response.status(201).json(survey);
  }

  async show(request: Request, response: Response) {
    const surveysRepository = getCustomRepository(SurveysRepository);

    const all = await surveysRepository.find();

    return response.json(all);
  }
}

export { SurveysController };