from django.conf import settings

from .a1_mock import A1MockConnector
from .a1_rest import A1RestConnector
from .base import BaseConnector
from .e2_ap import E2ApConnector
from .e2_mock import E2MockConnector
from .o1_mock import O1MockConnector
from .o1_netconf import O1NetconfConnector


def get_o1_connector(dut) -> BaseConnector:
    return O1MockConnector(dut) if settings.USE_MOCK_CONNECTORS else O1NetconfConnector(dut)


def get_a1_connector(dut) -> BaseConnector:
    return A1MockConnector(dut) if settings.USE_MOCK_CONNECTORS else A1RestConnector(dut)


def get_e2_connector(dut) -> BaseConnector:
    return E2MockConnector(dut) if settings.USE_MOCK_CONNECTORS else E2ApConnector(dut)


def get_connector_for_interface(iface: str, dut) -> BaseConnector:
    if iface == "O1":
        return get_o1_connector(dut)
    if iface == "A1":
        return get_a1_connector(dut)
    if iface == "E2":
        return get_e2_connector(dut)
    raise ValueError(f"Unknown interface: {iface}")
