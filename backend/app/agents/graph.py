from langgraph.graph import StateGraph, START, END

from app.agents.state import TripState
from app.agents.supervisor import supervisor_node
from app.agents.flight_agent import flight_agent_node
from app.agents.hotel_agent import hotel_agent_node
from app.agents.weather_agent import weather_agent_node
from app.agents.ground_transport_agent import ground_transport_agent_node
from app.agents.budget_agent import budget_agent_node
from app.agents.itinerary_agent import itinerary_agent_node


def build_graph():
    graph = StateGraph(TripState)

    graph.add_node("supervisor", supervisor_node)
    graph.add_node("flight_agent", flight_agent_node)
    graph.add_node("hotel_agent", hotel_agent_node)
    graph.add_node("weather_agent", weather_agent_node)
    graph.add_node("ground_transport_agent", ground_transport_agent_node)
    graph.add_node("budget_agent", budget_agent_node)
    graph.add_node("itinerary_agent", itinerary_agent_node)

    graph.add_edge(START, "supervisor")

    # Fan-out: supervisor triggers all research agents in parallel
    graph.add_edge("supervisor", "flight_agent")
    graph.add_edge("supervisor", "hotel_agent")
    graph.add_edge("supervisor", "weather_agent")
    graph.add_edge("supervisor", "ground_transport_agent")

    # Fan-in: budget_agent waits until all of them have finished
    graph.add_edge("flight_agent", "budget_agent")
    graph.add_edge("hotel_agent", "budget_agent")
    graph.add_edge("weather_agent", "budget_agent")
    graph.add_edge("ground_transport_agent", "budget_agent")

    graph.add_edge("budget_agent", "itinerary_agent")
    graph.add_edge("itinerary_agent", END)

    return graph.compile()


_compiled_graph = None


def get_graph():
    global _compiled_graph
    if _compiled_graph is None:
        _compiled_graph = build_graph()
    return _compiled_graph


async def run_trip_planner(trip_input: dict) -> TripState:
    graph = get_graph()
    result = await graph.ainvoke(trip_input)
    return result
