import type { NextApiRequest, NextApiResponse } from 'next'
import { getWindData } from '~/server/WindDataActions';
 
type ResponseData = {
  message: string
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {

    getWindData(10)
        .then((wd) => {
            if(wd.wind_histogram.length == 0 || wd.maxGust.direction == undefined){
          res.status(500).json({message: "Empty response from database (last 10 minutes)."})
            }else{

  res.status(200).json({ message: 'OK' })
            }
        })
        .catch((e) => {
          console.log(e);

          res.status(500).json({message: "Could not retrieve data from database."})
        });
}