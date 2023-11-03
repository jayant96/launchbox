import React from 'react'
import BlogView from 'src/views/BlogView'
import Airtable from 'airtable'

export const getServerSideProps = async () => {
  var base = new Airtable({ apiKey: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN }).base('appZF3lXw44wVKqkS')

  let recordsArr = []

  await new Promise((resolve, reject) => {
    base('Assistivai')
      .select({
        maxRecords: 10,
        view: 'Grid view'
      })
      .eachPage(
        (records, fetchNextPage) => {
          records.forEach(function (record) {
            // Only select the properties we're interested in
            recordsArr.push({
              id: record.id,
              fields: record.fields
            })
          })
          fetchNextPage()
        },
        function done(err) {
          if (err) {
            console.error(err)
            reject(err)
            return
          }

          resolve()
        }
      )
  })

  return {
    props: {
      records: recordsArr
    }
  }
}

const BlogPage = ({ records }) => {
  console.log('Blog details:', records)
  return <BlogView records={records} />
}

export default BlogPage
