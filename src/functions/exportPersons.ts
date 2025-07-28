import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { parseIntWithDefaultValue } from "./utilities";
import prisma from "./prismaModule";

/**
 * @param {InvocationContext} context - The Azure Functions context object.
 * @param {HttpRequest} req - The HTTP request.
 */
export async function getPersons(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit>
{
  context.log("HTTP trigger function processed a request.");
  let data = [];
  let total = 0;

  try
  {
    const start = parseIntWithDefaultValue(req.query.get("start"), 0);
    const limit = parseIntWithDefaultValue(req.query.get("limit"), 1000000000);
    const onlyPublic = req.query.get("onlyPublic") === "true";
    console.log("onlyPublic:", onlyPublic);

    const filters = onlyPublic
      ? {
        jobs: {
          some: {
            isPublic: true,
          },
        },
      }
      : {};

    let persons = await prisma.person.findMany({
      where: filters,
      include: {
        jobs: {
          include: {
            premises: true,
            clinic: true,
            section: true,
            jobPosition: true,
          },
        },
      },
      skip: start,
      take: limit,
    });

    total = persons.length;

    data = persons.map((person) =>
    {

      var jobs = person.jobs.filter((job) => job.isPublic || !onlyPublic);

      return {
        personalNumber: person.personalNumber,
        lastName: person.lastname,
        firstName: person.firstname,
        titleBefore: person.titleBefore,
        titleAfter: person.titleAfter,
        phone: person.phone,
        mobilePhone: person.mobilePhone,
        mobilePhoneShortcut: person.mobilePhoneShortcut,
        email: person.email,
        jobs: jobs.map((job) => ({
          jobInternalId: job.jobInternalId,
          clinicCode: job.clinic.code,
          abbr: job.clinic.abbr,
          sectionName: job.section.name,
          sectionCode: job.section.code,
          premisesName: job.premises?.name,
          jobTitle: job.jobPosition?.name,
          jobReferenceNumber: job.jobPosition?.referenceNumber,
          phoneExtension: job.phoneExtension,
          comment: job.comment,
          isPublic: job.isPublic,
        })),
      };
      
      // const personObj: any = {};
      // if (person.personalNumber != null) personObj.id = person.personalNumber;
      // if (person.lastname != null) personObj.lastName = person.lastname;
      // if (person.firstname != null) personObj.firstName = person.firstname;
      // if (person.titleBefore != null) personObj.titleBefore = person.titleBefore;
      // if (person.titleAfter != null) personObj.titleAfter = person.titleAfter;
      // if (person.phone != null) personObj.phone = person.phone;
      // if (person.mobilePhone != null) personObj.mobilePhone = person.mobilePhone;
      // if (person.mobilePhoneShortcut != null) personObj.mobilePhoneShortcut = person.mobilePhoneShortcut;
      // if (person.email != null) personObj.email = person.email;

      // const jobs = person.jobs.filter((job) => job.isPublic || !onlyPublic);

      // const resultJobs = jobs.map((job) => {
      //   const jobObj: any = {};
      //   if (job.jobInternalId != null) jobObj.jobInternalId = job.jobInternalId;
      //   if (job.clinic?.code != null) jobObj.clinicCode = job.clinic.code;
      //   if (job.section?.code != null) jobObj.sectionCode = job.section.code;
      //   if (job.premises?.name != null) jobObj.premisesName = job.premises.name;
      //   if (job.jobPosition?.referenceNumber != null) jobObj.jobReferenceNumber = job.jobPosition.referenceNumber;
      //   if (job.phoneExtension != null) jobObj.phoneExtension = job.phoneExtension;
      //   if (job.comment != null) jobObj.comment = job.comment;
      //   if (job.isPublic != null) jobObj.isPublic = job.isPublic;
      //   return jobObj;
      // });

      // if (resultJobs.length > 0) {
      //   personObj.jobs = resultJobs;
      // }

      // return personObj;


    }).filter((person) => person !== null);
  } catch (error)
  {
    console.error("Error fetching jobs:", error);
    return {
      status: 500,
      body: JSON.stringify({ error: error?.message }),
    };
  }
  return {
    status: 200,
    body: JSON.stringify({ total: total, data: data }),
  };
}

app.http("exportPersons", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "export/persons",
  handler: getPersons,
});
