import { Request, Response } from "express";

export async function getSettings(_req: Request, res: Response) {
  return res.json({
    settings: {
      brandName: "DigitalPylot",
      supportEmail: "support@digitalpylot.local",
    },
  });
}
