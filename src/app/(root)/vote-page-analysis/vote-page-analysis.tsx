// "use client"
// import { useState, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import Image from "next/image"
// import { useParams, useRouter } from "next/navigation"
// import { VoteButton } from "@/components/ui/votebutton"
// import { Input } from "@/components/ui/input"
// import { getSupabaseBrowserClient } from "@/config/client"
// import { Twitter, Facebook, Linkedin, PhoneIcon as WhatsApp, CheckCircle, ArrowLeft } from "lucide-react"

// // Component structure and key features:
// // 1. Fetches nominee data from Supabase based on URL parameter
// // 2. Displays nominee info with current vote count
// // 3. Allows users to vote with optional email and amount
// // 4. Shows confirmation screen with social sharing options
// // 5. Uses Framer Motion for smooth animations

// export default function VotePage() {
//   // State management for nominee data, voting process, and UI
//   const [nominee, setNominee] = useState(null)
//   const [category, setCategory] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [isVoted, setIsVoted] = useState(false)
//   const [email, setEmail] = useState("")
//   const [amount, setAmount] = useState("")
//   const [voteCount, setVoteCount] = useState(0)

//   const { id } = useParams()
//   const router = useRouter()
//   // disable any type error
//   // eslint-disable-next-line
//   // eslint-disable-next-line

//   useEffect(() => {
//     const fetchNomineeData = async () => {
//       if (!id) return

//       setLoading(true)
//       const supabase = getSupabaseBrowserClient()

//       // Fetch nominee with related category data
//       const { data: nomineeData, error: nomineeError } = await supabase
//         .from("nominee")
//         .select("*, category:categoryID(*)")
//         .eq("id", id)
//         .single()

//       if (nomineeError) {
//         console.error("Error fetching nominee:", nomineeError)
//         setLoading(false)
//         return
//       }

//       if (nomineeData) {
//         setNominee(nomineeData)
//         setCategory(nomineeData.category)

//         // Fetch vote count for this nominee - sum the numberOfVotes
//         const { data: voteData, error: voteError } = await supabase
//           .from("vote")
//           .select("numberOfVotes")
//           .eq("nomineeID", id)

//         if (!voteError && voteData) {
//           // Calculate the sum of all numberOfVotes
//           const totalVotes = voteData.reduce((sum, vote) => sum + (vote.numberOfVotes || 0), 0)
//           setVoteCount(totalVotes)
//         }
//       }

//       setLoading(false)
//     }

//     fetchNomineeData()
//   }, [id])

//   const handleVote = async () => {
//     if (!nominee) return

//     const supabase = getSupabaseBrowserClient()
//     const voteAmount = amount ? Number.parseInt(amount, 10) : 0

//     // Record the vote
//     const { error } = await supabase.from("vote").insert({
//       nomineeID: nominee.id,
//       referenceID: "ref1",
//       numberOfVotes: voteAmount,
//     })

//     if (error) {
//       console.error("Error recording vote:", error)
//       return
//     }

//     setIsVoted(true)
//     // Update the vote count by adding the new votes
//     setVoteCount((prevCount) => prevCount + voteAmount)
//   }

//   const shareUrl = typeof window !== "undefined" ? window.location.href : ""

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-zinc-100 flex items-center justify-center">
//         <div className="text-black text-xl">Loading nominee information...</div>
//       </div>
//     )
//   }

//   if (!nominee || !category) {
//     return (
//       <div className="min-h-screen bg-zinc-100 flex items-center justify-center">
//         <div className="text-black text-xl">Nominee not found</div>
//       </div>
//     )
//   }

//   return (
//     <motion.div className="min-h-screen bg-black-100 text-white">
//       <div className="max-w-4xl w-full">
//         <AnimatePresence mode="wait">
//           {!isVoted ? (
//             <motion.div
//               key="vote-card"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="bg-black border border-award-gold/20 rounded-lg p-8 shadow-lg"
//             >
//               <h1 className="text-3xl md:text-4xl text-award-gold mb-4 font-cinzel">{category.name}</h1>
//               <p className="text-award-silver mb-6 font-poppins">Nominee selected please confirm your choice!</p>

//               <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
//                 <motion.div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-award-gold">
//                   <Image src={nominee.image || "/placeholder.svg"} alt={nominee.name} layout="fill" objectFit="cover" />
//                 </motion.div>
//                 <div className="text-center md:text-left">
//                   <h2 className="text-2xl text-award-gold mb-2 font-cinzel">{nominee.name}</h2>
//                   <p className="text-award-silver mb-4 font-poppins">{nominee.shortcode || ""}</p>
//                   <p className="text-sm text-award-silver mb-2 font-poppins">Current Votes: {voteCount}</p>
//                 </div>
//               </div>

//               <div className="space-y-4 mb-6">
//                 <Input
//                   type="email"
//                   placeholder="Enter your email (optional)"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="bg-black/50 border-award-gold/20 text-white"
//                 />
//                 <Input
//                   type="number"
//                   placeholder="Enter amount"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   className="bg-black/50 border-award-gold/20 text-white"
//                 />
//               </div>

//               <VoteButton
//                 onClick={handleVote}
//                 className="w-full bg-award-gold hover:bg-award-gold/80 text-black py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
//               >
//                 Vote for {nominee.name}
//               </VoteButton>
//             </motion.div>
//           ) : (
//             <motion.div
//               key="confirmation"
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.9 }}
//               className="bg-black/90 border border-award-gold/20 rounded-lg p-8 shadow-lg text-center"
//             >
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ type: "spring", stiffness: 260, damping: 20 }}
//               >
//                 <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
//               </motion.div>

//               <h2 className="text-3xl font-bold text-award-gold mb-4 font-cinzel">Thank you for voting!</h2>
//               <p className="text-xl text-award-silver mb-6 font-poppins">
//                 You voted for {nominee.name} in the category: {category.name}
//               </p>
//               <div className="flex justify-center space-x-4 mb-8">
//                 <motion.a
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   href={`https://twitter.com/intent/tweet?text=I just voted for ${nominee.name} in the ${category.name} category!&url=${shareUrl}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-award-gold hover:text-award-gold/80"
//                 >
//                   <Twitter />
//                 </motion.a>
//                 <motion.a
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-award-gold hover:text-award-gold/80"
//                 >
//                   <Facebook />
//                 </motion.a>
//                 <motion.a
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-award-gold hover:text-award-gold/80"
//                 >
//                   <Linkedin />
//                 </motion.a>
//                 <motion.a
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   href={`https://wa.me/?text=I just voted for ${nominee.name} in the ${category.name} category! ${shareUrl}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-award-gold hover:text-award-gold/80"
//                 >
//                   <WhatsApp />
//                 </motion.a>
//               </div>
//               <VoteButton
//                 onClick={() => router.back()}
//                 className="bg-award-gold hover:bg-award-gold/80 text-black font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
//               >
//                 <ArrowLeft className="mr-2" /> Return to Nominees
//               </VoteButton>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </motion.div>
//   )
// }
